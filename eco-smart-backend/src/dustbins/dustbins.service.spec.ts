import { Test, TestingModule } from '@nestjs/testing';
import { DustbinsService } from './dustbins.service';
import { PrismaService } from '../prisma.service';

describe('DustbinsService', () => {
  let service: DustbinsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DustbinsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<DustbinsService>(DustbinsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
