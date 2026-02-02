process.env.DB_DATABASE =
  process.env.DB_DATABASE || 'src/database/sqlite.test.db';

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../../app.module';
import migrationDataSource from '../../database/data-source';
import { Promotion } from './entities/promotion.entity';
import { User } from '../user/entities/users.entity';
import { Favorite } from '../favorite/entities/favorite.entity';
import { AuditEvent } from '../audit-event/entities/audit-event.entity';
import { TraceIdInterceptor } from '../../common/interceptors/trace-id.interceptor';
import { ResponseTransformInterceptor } from '../../common/interceptors/response-transform.interceptor';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { ErrorCode } from '@promotions-favorites/shared';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

describe('PromotionController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let activePromotionId: string;
  let expiredPromotionId: string;

  beforeAll(async () => {
    await migrationDataSource.initialize();
    await migrationDataSource.runMigrations();
    await migrationDataSource.destroy();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalInterceptors(
      new TraceIdInterceptor(),
      new ResponseTransformInterceptor(),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    dataSource = app.get(DataSource);

    const userRepo = dataSource.getRepository(User);
    const promotionRepo = dataSource.getRepository(Promotion);
  const favoriteRepo = dataSource.getRepository(Favorite);
  const auditRepo = dataSource.getRepository(AuditEvent);

  // Clear child tables first to avoid foreign key violations when reseeding
  await favoriteRepo.clear();
  await auditRepo.clear();

    await userRepo.clear();
    await promotionRepo.clear();

    await userRepo.save(
      userRepo.create({
        id: TEST_USER_ID,
        username: 'demo-user',
      }),
    );

    const activePromotion = await promotionRepo.save(
      promotionRepo.create({
        title: 'Active Promo',
        merchant: 'Amazon',
        rewardAmount: 10,
        rewardCurrency: 'USD',
        description: 'Desc',
        terms: 'Terms',
        thumbnailUrl: 'thumb',
        expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      }),
    );

    const expiredPromotion = await promotionRepo.save(
      promotionRepo.create({
        title: 'Expired Promo',
        merchant: 'Amazon',
        rewardAmount: 5,
        rewardCurrency: 'USD',
        description: 'Desc',
        terms: 'Terms',
        thumbnailUrl: 'thumb',
        expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      }),
    );

    activePromotionId = activePromotion.id;
    expiredPromotionId = expiredPromotion.id;
  });

  beforeEach(async () => {
    await dataSource.getRepository(Favorite).clear();
    await dataSource.getRepository(AuditEvent).clear();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('GET /api/promotions returns promotions with meta', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/promotions?page=1&limit=10')
      .expect(200);

    expect(response.body.statusCode).toBe(200);
    expect(response.body.data.items.length).toBeGreaterThan(0);
    expect(response.body.data.items[0]).toHaveProperty('isFavorite');
    expect(response.body.traceId).toBeDefined();
  });

  it('POST /api/promotions/:promotionId/favorite is idempotent', async () => {
    await request(app.getHttpServer())
      .post(`/api/promotions/${activePromotionId}/favorite`)
      .expect(201);

    await request(app.getHttpServer())
      .post(`/api/promotions/${activePromotionId}/favorite`)
      .expect(201);

    const favorites = await dataSource.getRepository(Favorite).find();
    expect(favorites).toHaveLength(1);

    const audits = await dataSource.getRepository(AuditEvent).find();
    expect(audits).toHaveLength(1);
  });

  it('POST /api/promotions/:promotionId/favorite rejects expired promotion', async () => {
    const response = await request(app.getHttpServer())
      .post(`/api/promotions/${expiredPromotionId}/favorite`)
      .expect(400);

    expect(response.body.errorCode).toBe(ErrorCode.PROMOTION_EXPIRED);
  });

  it('DELETE /api/promotions/:promotionId/favorite is idempotent', async () => {
    await request(app.getHttpServer())
      .delete(`/api/promotions/${activePromotionId}/favorite`)
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/api/promotions/${activePromotionId}/favorite`)
      .expect(200);

    const favorites = await dataSource.getRepository(Favorite).find();
    expect(favorites).toHaveLength(0);
  });

  it('GET /api/promotions/favorites returns active/expired split and aggregates', async () => {
    await request(app.getHttpServer())
      .post(`/api/promotions/${activePromotionId}/favorite`)
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/api/promotions/favorites?page=1&limit=10')
      .expect(200);

    expect(response.body.data.active.length).toBeGreaterThan(0);
    expect(response.body.data.meta.totalFavorites).toBe(1);
  });
});
