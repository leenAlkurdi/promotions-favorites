import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditEventService } from './audit-event.service';
import { AuditEvent } from './entities/audit-event.entity';

describe('AuditEventService', () => {
  let service: AuditEventService;
  let auditRepo: Repository<AuditEvent>;

  beforeEach(async () => {
    const repoMock = {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditEventService,
        {
          provide: getRepositoryToken(AuditEvent),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<AuditEventService>(AuditEventService);
    auditRepo = module.get<Repository<AuditEvent>>(
      getRepositoryToken(AuditEvent),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('logs an audit event using repository', async () => {
    await service.logEvent('user-1', 'promo-1', 'FAVORITE');

    expect(auditRepo.create).toHaveBeenCalledWith({
      userId: 'user-1',
      promotionId: 'promo-1',
      action: 'FAVORITE',
    });
    expect(auditRepo.save).toHaveBeenCalled();
  });

  it('logs an audit event using provided manager', async () => {
    const managerRepo = {
      create: jest.fn().mockReturnValue({}),
      save: jest.fn(),
    };
    const manager = {
      getRepository: jest.fn().mockReturnValue(managerRepo),
    };

    await service.logEvent('user-1', 'promo-1', 'UNFAVORITE', manager as any);

    expect(manager.getRepository).toHaveBeenCalledWith(AuditEvent);
    expect(managerRepo.save).toHaveBeenCalled();
  });
});
