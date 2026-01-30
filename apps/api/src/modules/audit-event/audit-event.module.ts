import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditEventService } from './audit-event.service';
import { AuditEvent } from './entities/audit-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditEvent])],
  providers: [AuditEventService],
  exports: [AuditEventService],
})
export class AuditEventModule {}
