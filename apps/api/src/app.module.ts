import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PromotionModule } from './modules/promotion/promotion.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DB_DATABASE || './src/database/sqlite.db',
      autoLoadEntities: true,
      synchronize: false,
    }),
    PromotionModule,
    FavoriteModule,
    UserModule,

  ],
})
export class AppModule { }
