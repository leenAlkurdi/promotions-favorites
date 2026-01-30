import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoriteService } from './favorite.service';
import { Favorite } from './entities/favorite.entity';
import { Promotion } from '../promotion/entities/promotion.entity';
import { AuditEventModule } from '../audit-event/audit-event.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Promotion]), AuditEventModule],
  providers: [FavoriteService],
  exports: [FavoriteService],
})
export class FavoriteModule {}
