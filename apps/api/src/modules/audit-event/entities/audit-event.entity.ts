import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_events')
@Index(['userId'])
@Index(['promotionId'])
@Index(['timestamp'])
export class AuditEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  promotionId: string;

  @Column()
  action: string;

  @Column({ nullable: true })
  traceId?: string;

  @CreateDateColumn({ type: 'datetime' })
  timestamp: Date;
}
