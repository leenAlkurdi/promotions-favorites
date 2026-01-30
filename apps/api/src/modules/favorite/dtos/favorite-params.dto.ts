import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FavoriteParamsDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  promotionId: string;
}
