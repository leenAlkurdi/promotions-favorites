import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { Promotion } from '../promotion/entities/promotion.entity';
import { AuditEventService } from '../audit-event/audit-event.service';
import { GetFavoritesQueryDto } from './dtos/get-favorites-query.dto';
import { PAGINATION_DEFAULTS } from '@promotions-favorites/shared/constants';
import {
  AuditAction,
  ErrorCode,
  PromotionWithFavorite,
} from '@promotions-favorites/shared';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
    @InjectRepository(Promotion)
    private readonly promotionRepo: Repository<Promotion>,
    private readonly auditService: AuditEventService,
  ) {}

  async addFavorite(
    userId: string,
    promotionId: string,
    traceId?: string,
  ): Promise<PromotionWithFavorite> {
    try {
      const promotion = await this.findPromotionOrThrow(promotionId);
      this.ensurePromotionNotExpired(promotion);

      const existing = await this.favoriteRepo.findOne({
        where: { userId, promotionId },
      });

      if (!existing) {
        await this.favoriteRepo.manager.transaction(async (manager) => {
          const favorite = manager.create(Favorite, { userId, promotionId });
          await manager.save(Favorite, favorite);
          await this.auditService.logEvent(
            userId,
            promotionId,
            AuditAction.FAVORITE,
            traceId,
            manager,
          );
        });
      }

      return this.mapPromotion(promotion, true);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException({
          message: 'Database error',
          errorCode: ErrorCode.DATABASE_ERROR,
        });
      }
      throw error;
    }
  }

  async removeFavorite(
    userId: string,
    promotionId: string,
    traceId?: string,
  ): Promise<PromotionWithFavorite> {
    try {
      const promotion = await this.findPromotionOrThrow(promotionId);

      const existing = await this.favoriteRepo.findOne({
        where: { userId, promotionId },
      });

      if (existing) {
        await this.favoriteRepo.manager.transaction(async (manager) => {
          await manager.remove(Favorite, existing);
          await this.auditService.logEvent(
            userId,
            promotionId,
            AuditAction.UNFAVORITE,
            traceId,
            manager,
          );
        });
      }

      return this.mapPromotion(promotion, false);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException({
          message: 'Database error',
          errorCode: ErrorCode.DATABASE_ERROR,
        });
      }
      throw error;
    }
  }

  async listFavorites(
    userId: string,
    query: GetFavoritesQueryDto,
  ): Promise<{
    active: PromotionWithFavorite[];
    expired: PromotionWithFavorite[];
    meta: {
      page: number;
      limit: number;
      totalFavorites: number;
      totalPotentialRewards: number;
      nextPageCursor: string | null;
    };
  }> {
    try {
      this.validateQuery(query);

      const limit = Math.min(
        query.limit ?? PAGINATION_DEFAULTS.LIMIT,
        PAGINATION_DEFAULTS.MAX_LIMIT,
      );
      const cursor = query.cursor ? this.parseCursor(query.cursor) : null;
      const now = Date.now();

      const favoritesQb = this.favoriteRepo
        .createQueryBuilder('favorite')
        .innerJoinAndSelect('favorite.promotion', 'promotion')
        .where('favorite.userId = :userId', { userId })
        .orderBy('promotion.expiresAt', 'ASC')
        .addOrderBy('promotion.id', 'ASC')
        .take(limit + 1);

      if (cursor) {
        favoritesQb.andWhere(
          '(promotion.expiresAt > :cursorDate OR (promotion.expiresAt = :cursorDate AND promotion.id > :cursorId))',
          {
            cursorDate: cursor.expiresAt,
            cursorId: cursor.id,
          },
        );
      }

      const favorites = await favoritesQb.getMany();

      const aggregates = await this.favoriteRepo
        .createQueryBuilder('favorite')
        .innerJoin('favorite.promotion', 'promotion')
        .where('favorite.userId = :userId', { userId })
        .select('COUNT(*)', 'totalFavorites')
        .addSelect(
          'COALESCE(SUM(CASE WHEN promotion.expiresAt >= :now THEN promotion.rewardAmount ELSE 0 END), 0)',
          'totalPotentialRewards',
        )
        .setParameter('now', new Date(now))
        .getRawOne<{
          totalFavorites: string | number;
          totalPotentialRewards: string | number;
        }>();

      const totalFavorites = Number(aggregates?.totalFavorites ?? 0);
      const totalPotentialRewards = Number(
        aggregates?.totalPotentialRewards ?? 0,
      );

      const hasMore = favorites.length > limit;
      const pageFavorites = hasMore ? favorites.slice(0, limit) : favorites;

      const active: PromotionWithFavorite[] = [];
      const expired: PromotionWithFavorite[] = [];

      for (const favorite of pageFavorites) {
        const promotion = favorite.promotion;
        const mapped = this.mapPromotion(promotion, true);
        const isExpired = new Date(promotion.expiresAt).getTime() < now;
        if (isExpired) {
          expired.push(mapped);
        } else {
          active.push(mapped);
        }
      }

      const lastFavorite = pageFavorites.at(-1);
      const nextCursor =
        hasMore && lastFavorite?.promotion
          ? `${new Date(lastFavorite.promotion.expiresAt).toISOString()}|${lastFavorite.promotion.id}`
          : null;

      return {
        active,
        expired,
        meta: {
          page: query.page ?? PAGINATION_DEFAULTS.PAGE,
          limit,
          totalFavorites,
          totalPotentialRewards,
          nextPageCursor: nextCursor,
        },
      };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException({
          message: 'Database error',
          errorCode: ErrorCode.DATABASE_ERROR,
        });
      }
      throw error;
    }
  }

  private validateQuery(query: GetFavoritesQueryDto): void {
    if (query.page !== undefined && query.page < 1) {
      throw new BadRequestException({
        message: 'Invalid page value',
        errorCode: ErrorCode.INVALID_PAGINATION,
      });
    }

    if (
      query.limit !== undefined &&
      (query.limit < 1 || query.limit > PAGINATION_DEFAULTS.MAX_LIMIT)
    ) {
      throw new BadRequestException({
        message: 'Invalid limit value',
        errorCode: ErrorCode.INVALID_PAGINATION,
      });
    }

    if (query.cursor) {
      const parts = query.cursor.split('|');
      if (
        parts.length !== 2 ||
        !parts[0] ||
        !parts[1] ||
        isNaN(Date.parse(parts[0]))
      ) {
        throw new BadRequestException({
          message: 'Invalid cursor value',
          errorCode: ErrorCode.INVALID_PAGINATION,
        });
      }
    }
  }

  private parseCursor(cursor: string): { expiresAt: Date; id: string } {
    const [expiresAtRaw, id] = cursor.split('|');
    return { expiresAt: new Date(expiresAtRaw), id };
  }

  private async findPromotionOrThrow(promotionId: string): Promise<Promotion> {
    const promotion = await this.promotionRepo.findOne({
      where: { id: promotionId },
    });

    if (!promotion) {
      throw new NotFoundException({
        message: 'Promotion not found',
        errorCode: ErrorCode.PROMOTION_NOT_FOUND,
      });
    }

    return promotion;
  }

  private ensurePromotionNotExpired(promotion: Promotion): void {
    const expiresAt = new Date(promotion.expiresAt).getTime();
    if (expiresAt < Date.now()) {
      throw new BadRequestException({
        message: 'Promotion expired',
        errorCode: ErrorCode.PROMOTION_EXPIRED,
      });
    }
  }

  private mapPromotion(
    promotion: Promotion,
    isFavorite: boolean,
  ): PromotionWithFavorite {
    const expiresAt = new Date(promotion.expiresAt);
    const daysUntilExpiry = Math.ceil(
      (expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
    );
    const { favorites, ...base } = promotion;

    return {
      ...base,
      expiresAt: expiresAt.toISOString(),
      isFavorite,
      daysUntilExpiry,
    };
  }
}
