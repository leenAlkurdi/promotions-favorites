import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository, SelectQueryBuilder } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { GetPromotionsQueryDto } from './dtos/get-promotions-query.dto';
import { PAGINATION_DEFAULTS } from '@promotions-favorites/shared/constants';
import { ErrorCode, PromotionWithFavorite } from '@promotions-favorites/shared';

@Injectable()
export class PromotionService {
	constructor(
		@InjectRepository(Promotion)
		private readonly promotionRepo: Repository<Promotion>,
	) {}

	async findAll(
		query: GetPromotionsQueryDto,
		userId: string,
	): Promise<{
		items: PromotionWithFavorite[];
		page: number;
		limit: number;
		total: number;
	}> {
		try {
			this.ensureUser(userId);
			this.validateQuery(query);

			const page = query.page ?? PAGINATION_DEFAULTS.PAGE;
			const limit = Math.min(
				query.limit ?? PAGINATION_DEFAULTS.LIMIT,
				PAGINATION_DEFAULTS.MAX_LIMIT,
			);
			const offset = (page - 1) * limit;

			const qb = this.buildPromotionQuery(query, userId)
				.orderBy('promotion.expiresAt', 'ASC')
				.skip(offset)
				.take(limit);

			const [entities, total] = await qb.getManyAndCount();
			const items = entities.map((promotion) => this.mapToMeta(promotion));

			return { items, page, limit, total };
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

	private ensureUser(userId: string): void {
		if (!userId) {
			throw new UnauthorizedException({
				message: 'Unauthorized',
				errorCode: ErrorCode.UNAUTHORIZED,
			});
		}
	}

	private validateQuery(query: GetPromotionsQueryDto): void {
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

		if (
			query.expiresBefore &&
			Number.isNaN(Date.parse(query.expiresBefore))
		) {
			throw new BadRequestException({
				message: 'Invalid expiresBefore value',
				errorCode: ErrorCode.INVALID_QUERY,
			});
		}
	}

	private buildPromotionQuery(
		query: GetPromotionsQueryDto,
		userId: string,
	): SelectQueryBuilder<Promotion> {
		const qb = this.promotionRepo.createQueryBuilder('promotion');

		if (query.q) {
			qb.andWhere(
				'(promotion.title LIKE :q OR promotion.merchant LIKE :q)',
				{ q: `%${query.q}%` },
			);
		}

		if (query.merchant) {
			qb.andWhere('promotion.merchant = :merchant', {
				merchant: query.merchant,
			});
		}

		if (query.expiresBefore) {
			qb.andWhere('promotion.expiresAt < :expiresBefore', {
				expiresBefore: query.expiresBefore,
			});
		}

		qb.loadRelationIdAndMap(
			'promotion.favoriteId',
			'promotion.favorites',
			'favorite',
			(subQb) =>
				subQb.andWhere('favorite.userId = :userId', { userId }),
		);

		return qb;
	}

	private mapToMeta(promotion: Promotion): PromotionWithFavorite {
		const favoriteId = (promotion as Promotion & { favoriteId?: string })
			.favoriteId;
		const expiresAt = new Date(promotion.expiresAt);
		const daysUntilExpiry = Math.ceil(
			(expiresAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000),
		);
		const { favorites, ...base } = promotion;

		return {
			...base,
			expiresAt: expiresAt.toISOString(),
			isFavorite: Boolean(favoriteId),
			daysUntilExpiry,
		};
	}
}
