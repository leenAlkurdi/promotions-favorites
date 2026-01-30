import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
} from 'typeorm';
import { User } from '../../user/entities/users.entity';
import { Promotion } from '../../promotion/entities/promotion.entity';

@Entity('favorites')
@Unique(['userId', 'promotionId'])
export class Favorite {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    promotionId: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Promotion, { nullable: false })
    @JoinColumn({ name: 'promotionId' })
    promotion: Promotion;

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;
}