import { Test, TestingModule } from '@nestjs/testing';
import { AuditEventService } from './audit-event.service';

describe('AuditEventService', () => {
  let service: AuditEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditEventService],
    }).compile();

    service = module.get<AuditEventService>(AuditEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
