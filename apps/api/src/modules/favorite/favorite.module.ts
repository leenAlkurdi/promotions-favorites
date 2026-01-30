import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteService } from './favorite.service';
import { Favorite } from './entities/favorite.entity';
import { Promotion } from '../promotion/entities/promotion.entity';
import { AuditEvent } from '../audit-event/entities/audit-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Promotion, AuditEvent])],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
