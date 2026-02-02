import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ErrorCode } from '@promotions-favorites/shared';
import { PromotionService } from './promotion.service';
import { Promotion } from './entities/promotion.entity';

describe('PromotionService', () => {
  let service: PromotionService;
  let promotionRepo: Repository<Promotion>;

  const createQueryBuilderMock = () => ({
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    loadRelationIdAndMap: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn(),
  });

  beforeEach(async () => {
    const repoMock = {
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionService,
        {
          provide: getRepositoryToken(Promotion),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<PromotionService>(PromotionService);
    promotionRepo = module.get<Repository<Promotion>>(
      getRepositoryToken(Promotion),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns paginated promotions with metadata', async () => {
    const qb = createQueryBuilderMock();
    const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const entities = [
      {
        id: 'promo-1',
        title: 'Promo',
        merchant: 'Amazon',
        rewardAmount: 10,
        rewardCurrency: 'USD',
        description: 'Desc',
        terms: 'Terms',
        thumbnailUrl: 'thumb',
        expiresAt,
        createdAt: new Date(),
      } as Promotion,
    ];
    qb.getManyAndCount.mockResolvedValue([entities, 1]);
    (promotionRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

    const result = await service.findAll({ page: 1, limit: 10 }, 'user-1');

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.items[0].isFavorite).toBe(false);
    expect(result.items[0].daysUntilExpiry).toBeGreaterThan(0);
  });

  it('throws INVALID_PAGINATION on invalid page', async () => {
    await expect(
      service.findAll({ page: 0, limit: 10 }, 'user-1'),
    ).rejects.toMatchObject({
      response: {
        errorCode: ErrorCode.INVALID_PAGINATION,
      },
    });
  });

  it('throws DATABASE_ERROR on query failure', async () => {
    const qb = createQueryBuilderMock();
    qb.getManyAndCount.mockRejectedValue(
      new QueryFailedError('SELECT', [], new Error('fail')),
    );
    (promotionRepo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

    await expect(
      service.findAll({ page: 1, limit: 10 }, 'user-1'),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
