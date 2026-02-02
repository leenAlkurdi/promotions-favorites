import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ErrorCode } from '@promotions-favorites/shared';
import { FavoriteService } from './favorite.service';
import { Favorite } from './entities/favorite.entity';
import { Promotion } from '../promotion/entities/promotion.entity';
import { AuditEventService } from '../audit-event/audit-event.service';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let favoriteRepo: Repository<Favorite>;
  let promotionRepo: Repository<Promotion>;
  let auditService: AuditEventService;

  const createQueryBuilderMock = () => ({
    innerJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    setParameter: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getRawOne: jest.fn(),
  });

  beforeEach(async () => {
    const favoriteRepoMock = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
      manager: {
        transaction: jest.fn(),
      },
    };

    const promotionRepoMock = {
      findOne: jest.fn(),
    };

    const auditServiceMock = {
      logEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoriteService,
        {
          provide: getRepositoryToken(Favorite),
          useValue: favoriteRepoMock,
        },
        {
          provide: getRepositoryToken(Promotion),
          useValue: promotionRepoMock,
        },
        {
          provide: AuditEventService,
          useValue: auditServiceMock,
        },
      ],
    }).compile();

    service = module.get<FavoriteService>(FavoriteService);
    favoriteRepo = module.get<Repository<Favorite>>(
      getRepositoryToken(Favorite),
    );
    promotionRepo = module.get<Repository<Promotion>>(
      getRepositoryToken(Promotion),
    );
    auditService = module.get<AuditEventService>(AuditEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('adds favorite and logs audit event', async () => {
    const promotion = {
      id: 'promo-1',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    } as Promotion;

    (promotionRepo.findOne as jest.Mock).mockResolvedValue(promotion);
    (favoriteRepo.findOne as jest.Mock).mockResolvedValue(null);

    (favoriteRepo.manager.transaction as jest.Mock).mockImplementation(
      async (cb: (manager: any) => Promise<void>) => {
        const manager = {
          create: jest.fn().mockReturnValue({}),
          save: jest.fn(),
          remove: jest.fn(),
        };
        await cb(manager);
      },
    );

    const result = await service.addFavorite('user-1', 'promo-1');

    expect(result.isFavorite).toBe(true);
    expect(auditService.logEvent).toHaveBeenCalled();
  });

  it('is idempotent when favorite already exists', async () => {
    const promotion = {
      id: 'promo-1',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    } as Promotion;

    (promotionRepo.findOne as jest.Mock).mockResolvedValue(promotion);
    (favoriteRepo.findOne as jest.Mock).mockResolvedValue({ id: 'fav-1' });

    await service.addFavorite('user-1', 'promo-1');

    expect(favoriteRepo.manager.transaction).not.toHaveBeenCalled();
  });

  it('throws PROMOTION_NOT_FOUND when promotion missing', async () => {
    (promotionRepo.findOne as jest.Mock).mockResolvedValue(null);

    await expect(
      service.addFavorite('user-1', 'promo-x'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('throws PROMOTION_EXPIRED when promotion expired', async () => {
    const promotion = {
      id: 'promo-1',
      expiresAt: new Date(Date.now() - 1000),
    } as Promotion;

    (promotionRepo.findOne as jest.Mock).mockResolvedValue(promotion);

    await expect(
      service.addFavorite('user-1', 'promo-1'),
    ).rejects.toMatchObject({
      response: { errorCode: ErrorCode.PROMOTION_EXPIRED },
    });
  });

  it('removes favorite and logs audit event', async () => {
    const promotion = {
      id: 'promo-1',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    } as Promotion;

    (promotionRepo.findOne as jest.Mock).mockResolvedValue(promotion);
    (favoriteRepo.findOne as jest.Mock).mockResolvedValue({ id: 'fav-1' });

    (favoriteRepo.manager.transaction as jest.Mock).mockImplementation(
      async (cb: (manager: any) => Promise<void>) => {
        const manager = {
          create: jest.fn().mockReturnValue({}),
          save: jest.fn(),
          remove: jest.fn(),
        };
        await cb(manager);
      },
    );

    const result = await service.removeFavorite('user-1', 'promo-1');

    expect(result.isFavorite).toBe(false);
    expect(auditService.logEvent).toHaveBeenCalled();
  });

  it('is idempotent when removing non-existing favorite', async () => {
    const promotion = {
      id: 'promo-1',
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    } as Promotion;

    (promotionRepo.findOne as jest.Mock).mockResolvedValue(promotion);
    (favoriteRepo.findOne as jest.Mock).mockResolvedValue(null);

    const result = await service.removeFavorite('user-1', 'promo-1');

    expect(result.isFavorite).toBe(false);
  });

  it('lists favorites with active/expired split and aggregates', async () => {
    const now = Date.now();
    const activePromotion = {
      id: 'promo-active',
      expiresAt: new Date(now + 1000 * 60 * 60),
      rewardAmount: 10,
    } as Promotion;
    const expiredPromotion = {
      id: 'promo-expired',
      expiresAt: new Date(now - 1000),
      rewardAmount: 5,
    } as Promotion;

    const favoritesQb = createQueryBuilderMock();
    favoritesQb.getMany.mockResolvedValue([
      { promotion: activePromotion },
      { promotion: expiredPromotion },
    ]);

    const totalsQb = createQueryBuilderMock();
    totalsQb.getRawOne.mockResolvedValue({
      totalFavorites: '2',
      totalPotentialRewards: '15',
    });

    (favoriteRepo.createQueryBuilder as jest.Mock)
      .mockReturnValueOnce(favoritesQb)
      .mockReturnValueOnce(totalsQb);

    const result = await service.listFavorites('user-1', {
      page: 1,
      limit: 10,
    });

    expect(result.active).toHaveLength(1);
    expect(result.expired).toHaveLength(1);
    expect(result.meta.totalFavorites).toBe(2);
    expect(result.meta.totalPotentialRewards).toBe(15);
  });

  it('throws DATABASE_ERROR on query failure', async () => {
    const favoritesQb = createQueryBuilderMock();
    favoritesQb.getMany.mockRejectedValue(
      new QueryFailedError('SELECT', [], new Error('fail')),
    );
    (favoriteRepo.createQueryBuilder as jest.Mock).mockReturnValue(favoritesQb);

    await expect(
      service.listFavorites('user-1', { page: 1, limit: 10 }),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
