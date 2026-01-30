import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { GetPromotionsQueryDto } from './dtos/get-promotions-query.dto';
import { MockAuthGuard } from '../../common/guards/mock-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FavoriteService } from '../favorite/favorite.service';
import { FavoriteParamsDto } from '../favorite/dtos/favorite-params.dto';
import { GetFavoritesQueryDto } from '../favorite/dtos/get-favorites-query.dto';

type CurrentUserPayload = {
  id: string;
};

@Controller('promotions')
export class PromotionController {
  constructor(
    private readonly promotionService: PromotionService,
    private readonly favoriteService: FavoriteService,
  ) {}

  @Get()
  @UseGuards(MockAuthGuard)
  async getPromotions(
    @Query() query: GetPromotionsQueryDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.promotionService.findAll(query, user.id);
  }

  @Post(':promotionId/favorite')
  @UseGuards(MockAuthGuard)
  addFavorite(
    @Param() params: FavoriteParamsDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.favoriteService.addFavorite(user.id, params.promotionId);
  }

  @Delete(':promotionId/favorite')
  @UseGuards(MockAuthGuard)
  removeFavorite(
    @Param() params: FavoriteParamsDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.favoriteService.removeFavorite(user.id, params.promotionId);
  }

  @Get('favorites')
  @UseGuards(MockAuthGuard)
  listFavorites(
    @Query() query: GetFavoritesQueryDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.favoriteService.listFavorites(user.id, query);
  }
}
