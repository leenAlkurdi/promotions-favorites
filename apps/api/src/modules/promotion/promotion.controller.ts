import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { GetPromotionsQueryDto } from './dtos/get-promotions-query.dto';
import { MockAuthGuard } from '../../common/guards/mock-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

type CurrentUserPayload = {
  id: string;
};

@Controller('promotions')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Get()
  @UseGuards(MockAuthGuard)
  async getPromotions(
    @Query() query: GetPromotionsQueryDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.promotionService.findAll(query, user.id);
  }
}
