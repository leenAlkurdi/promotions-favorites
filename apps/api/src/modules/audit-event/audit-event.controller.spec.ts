import { Test, TestingModule } from '@nestjs/testing';
import { AuditEventController } from './audit-event.controller';
import { AuditEventService } from './audit-event.service';

describe('AuditEventController', () => {
  let controller: AuditEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuditEventController],
      providers: [AuditEventService],
    }).compile();

    controller = module.get<AuditEventController>(AuditEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
