import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PromotionService } from './promotion.service';
import { GetPromotionsQueryDto } from './dtos/get-promotions-query.dto';
import { MockAuthGuard } from '../../common/guards/mock-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { FavoriteService } from '../favorite/favorite.service';
import { FavoriteParamsDto } from '../favorite/dtos/favorite-params.dto';
import { GetFavoritesQueryDto } from '../favorite/dtos/get-favorites-query.dto';
import { Request } from 'express';

type CurrentUserPayload = {
  id: string;
};

@ApiTags('promotions')
@Controller('promotions')
export class PromotionController {
  constructor(
    private readonly promotionService: PromotionService,
    private readonly favoriteService: FavoriteService,
  ) {}

  @Get('merchants')
  @ApiOperation({ summary: 'List distinct merchants' })
  @ApiOkResponse({ description: 'Merchants retrieved' })
  async getMerchants() {
    return this.promotionService.listMerchants();
  }

  @Get()
  @UseGuards(MockAuthGuard)
  @ApiOperation({ summary: 'List promotions with filters and pagination' })
  @ApiOkResponse({ description: 'Promotions retrieved' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getPromotions(
    @Query() query: GetPromotionsQueryDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.promotionService.findAll(query, user.id);
  }

  @Post(':promotionId/favorite')
  @UseGuards(MockAuthGuard)
  @ApiOperation({ summary: 'Add promotion to favorites' })
  @ApiParam({ name: 'promotionId', format: 'uuid' })
  @ApiCreatedResponse({ description: 'Favorite created or already exists' })
  @ApiBadRequestResponse({
    description: 'Promotion expired or invalid request',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  addFavorite(
    @Param() params: FavoriteParamsDto,
    @CurrentUser() user: CurrentUserPayload,
    @Req() req: Request & { traceId?: string },
  ) {
    return this.favoriteService.addFavorite(
      user.id,
      params.promotionId,
      req.traceId,
    );
  }

  @Delete(':promotionId/favorite')
  @UseGuards(MockAuthGuard)
  @ApiOperation({ summary: 'Remove promotion from favorites' })
  @ApiParam({ name: 'promotionId', format: 'uuid' })
  @ApiOkResponse({ description: 'Favorite removed or did not exist' })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  removeFavorite(
    @Param() params: FavoriteParamsDto,
    @CurrentUser() user: CurrentUserPayload,
    @Req() req: Request & { traceId?: string },
  ) {
    return this.favoriteService.removeFavorite(
      user.id,
      params.promotionId,
      req.traceId,
    );
  }

  @Get('favorites')
  @UseGuards(MockAuthGuard)
  @ApiOperation({ summary: 'List favorites with aggregates' })
  @ApiOkResponse({ description: 'Favorites retrieved' })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  listFavorites(
    @Query() query: GetFavoritesQueryDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.favoriteService.listFavorites(user.id, query);
  }
}
