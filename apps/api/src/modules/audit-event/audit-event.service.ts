import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AuditEvent } from './entities/audit-event.entity';

@Injectable()
export class AuditEventService {
	constructor(
		@InjectRepository(AuditEvent)
		private readonly auditRepo: Repository<AuditEvent>,
	) {}

	async logEvent(
		userId: string,
		promotionId: string,
		action: string,
		traceId?: string,
		manager?: EntityManager,
	): Promise<void> {
		const repo = manager ? manager.getRepository(AuditEvent) : this.auditRepo;
		const audit = repo.create({ userId, promotionId, action, traceId });
		await repo.save(audit);
	}
}
