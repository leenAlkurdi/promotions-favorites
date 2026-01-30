import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('audit_events')
export class AuditEvent {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	userId: string;

	@Column()
	promotionId: string;

	@Column()
	action: string;

	@CreateDateColumn({ type: 'datetime' })
	timestamp: Date;
}
