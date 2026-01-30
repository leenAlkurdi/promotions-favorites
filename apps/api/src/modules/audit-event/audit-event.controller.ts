import { Controller } from '@nestjs/common';
import { AuditEventService } from './audit-event.service';

@Controller('audit-event')
export class AuditEventController {
  constructor(private readonly auditEventService: AuditEventService) {}
}
