import { Test, TestingModule } from '@nestjs/testing';
import { PromotionController } from './promotion.controller';
import { PromotionService } from './promotion.service';
import { FavoriteService } from '../favorite/favorite.service';

describe('PromotionController', () => {
  let controller: PromotionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromotionController],
      providers: [
        {
          provide: PromotionService,
          useValue: {
            findAll: jest.fn(),
          },
        },
        {
          provide: FavoriteService,
          useValue: {
            addFavorite: jest.fn(),
            removeFavorite: jest.fn(),
            listFavorites: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PromotionController>(PromotionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
