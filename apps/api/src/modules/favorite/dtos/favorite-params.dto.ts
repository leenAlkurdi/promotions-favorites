import { IsUUID } from 'class-validator';

export class FavoriteParamsDto {
  @IsUUID()
  promotionId: string;
}
