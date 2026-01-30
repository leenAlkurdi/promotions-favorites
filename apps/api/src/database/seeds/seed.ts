import { Logger } from '@nestjs/common';
import dataSource from '../data-source';
import { User } from '../../modules/user/entities/users.entity';
import { Promotion } from '../../modules/promotion/entities/promotion.entity';

const DAYS = 24 * 60 * 60 * 1000;

type PromotionSeed = Omit<Promotion, 'id' | 'createdAt'>;

const createPromotion = (
  title: string,
  merchant: string,
  rewardAmount: number,
  rewardCurrency: string,
  description: string,
  terms: string,
  thumbnailUrl: string,
  expiresInDays: number,
): PromotionSeed => ({
  title,
  merchant,
  rewardAmount,
  rewardCurrency,
  description,
  terms,
  thumbnailUrl,
  expiresAt: new Date(Date.now() + expiresInDays * DAYS),
});

async function seed(): Promise<void> {
  const start = Date.now();
  const logger = new Logger('Seed');
  logger.log('Starting seed...');

  try {
    await dataSource.initialize();

    const userRepo = dataSource.getRepository(User);
    const promoRepo = dataSource.getRepository(Promotion);

    await promoRepo.clear();
    await userRepo.clear();

    const user = userRepo.create({
      id: '00000000-0000-0000-0000-000000000001',
      username: 'demo-user',
    });

    await userRepo.save(user);

    const promotions: PromotionSeed[] = [
      createPromotion(
        '50% Cashback on Groceries',
        'Carrefour',
        50,
        'AED',
        'Get cashback on groceries.',
        'Valid once per user.',
        'https://picsum.photos/seed/carrefour/200',
        7,
      ),
      createPromotion(
        '10% Off Electronics',
        'Amazon',
        10,
        'USD',
        'Save on selected electronics.',
        'Valid on items marked eligible.',
        'https://picsum.photos/seed/amazon/200',
        14,
      ),
      createPromotion(
        'Cashback on Dining',
        'Talabat',
        20,
        'AED',
        'Earn cashback on restaurant orders.',
        'Max cashback 20 AED per order.',
        'https://picsum.photos/seed/talabat/200',
        3,
      ),
      createPromotion(
        'Fuel Savings',
        'ENOC',
        5,
        'AED',
        'Cashback on fuel purchases.',
        'Applicable to fuel only.',
        'https://picsum.photos/seed/enoc/200',
        10,
      ),
      createPromotion(
        'Weekend Fashion Sale',
        'Namshi',
        15,
        'AED',
        'Save on fashion items.',
        'Valid over the weekend only.',
        'https://picsum.photos/seed/namshi/200',
        5,
      ),
      createPromotion(
        'Gym Membership Discount',
        'Fitness Time',
        30,
        'AED',
        'Discount on monthly membership.',
        'New members only.',
        'https://picsum.photos/seed/fitness/200',
        20,
      ),
      createPromotion(
        'Hotel Booking Cashback',
        'Booking.com',
        25,
        'USD',
        'Cashback on hotel bookings.',
        'Minimum stay 2 nights.',
        'https://picsum.photos/seed/booking/200',
        30,
      ),
      createPromotion(
        'Ride Cashback',
        'Careem',
        8,
        'AED',
        'Cashback on rides.',
        'Valid on all ride types.',
        'https://picsum.photos/seed/careem/200',
        2,
      ),
      createPromotion(
        'Pharmacy Savings',
        'Life Pharmacy',
        12,
        'AED',
        'Save on health essentials.',
        'Selected items only.',
        'https://picsum.photos/seed/life/200',
        12,
      ),
      createPromotion(
        'Travel Gear Offer',
        'Samsonite',
        18,
        'USD',
        'Discount on luggage.',
        'Valid on selected items.',
        'https://picsum.photos/seed/samsonite/200',
        9,
      ),
      createPromotion(
        'Grocery Cashback',
        'Spinneys',
        25,
        'AED',
        'Weekly grocery cashback.',
        'Valid once per week.',
        'https://picsum.photos/seed/spinneys/200',
        6,
      ),
      createPromotion(
        'Coffee Rewards',
        'Starbucks',
        5,
        'AED',
        'Earn cashback on coffee.',
        'Valid on beverages only.',
        'https://picsum.photos/seed/starbucks/200',
        4,
      ),
      createPromotion(
        'Home Essentials',
        'IKEA',
        20,
        'AED',
        'Save on home essentials.',
        'Valid on selected products.',
        'https://picsum.photos/seed/ikea/200',
        15,
      ),
      createPromotion(
        'Streaming Offer',
        'Netflix',
        7,
        'USD',
        'Cashback on subscription.',
        'Monthly plan only.',
        'https://picsum.photos/seed/netflix/200',
        11,
      ),
      createPromotion(
        'Tech Accessories',
        'Noon',
        9,
        'AED',
        'Save on tech accessories.',
        'Applies to accessories only.',
        'https://picsum.photos/seed/noon/200',
        8,
      ),
      createPromotion(
        'Kids Toys Cashback',
        'ToyRus',
        14,
        'USD',
        'Cashback on kids toys.',
        'Selected brands only.',
        'https://picsum.photos/seed/toyrus/200',
        13,
      ),
      createPromotion(
        'Beauty Essentials',
        'Sephora',
        12,
        'USD',
        'Save on beauty products.',
        'Valid on select items.',
        'https://picsum.photos/seed/sephora/200',
        1,
      ),
      createPromotion(
        'Pet Supplies',
        'PetSmart',
        10,
        'USD',
        'Cashback on pet supplies.',
        'Food and toys only.',
        'https://picsum.photos/seed/petsmart/200',
        -2,
      ),
      createPromotion(
        'Gadget Week',
        'Sharaf DG',
        22,
        'AED',
        'Cashback on gadgets.',
        'Valid during gadget week.',
        'https://picsum.photos/seed/sharaf/200',
        -5,
      ),
      createPromotion(
        'Bank Offer',
        'Emirates NBD',
        30,
        'AED',
        'Cashback on card spend.',
        'Minimum spend applies.',
        'https://picsum.photos/seed/enbd/200',
        -1,
      ),
    ];

    await promoRepo.save(promotions);

    const durationMs = Date.now() - start;
    logger.log(`Completed successfully in ${durationMs}ms`);
  } catch (error) {
    logger.error('Failed with error', error as Error);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

seed();