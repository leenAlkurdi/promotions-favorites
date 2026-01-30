import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('promotions')
@Index(['title'])
@Index(['merchant'])
@Index(['expiresAt'])
export class Promotion {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	title: string;

	@Column()
	merchant: string;

	@Column('decimal')
	rewardAmount: number;

	@Column()
	rewardCurrency: string;

	@Column('text')
	description: string;

	@Column('text')
	terms: string;

	@Column()
	thumbnailUrl: string;

	@Column({ type: 'datetime' })
	expiresAt: Date;

	@CreateDateColumn({ type: 'datetime' })
	createdAt: Date;

	
}
