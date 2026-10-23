import { Test, TestingModule } from '@nestjs/testing';
import { DustbinsController } from './dustbins.controller';
import { DustbinsService } from './dustbins.service';

describe('DustbinsController', () => {
  let controller: DustbinsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DustbinsController],
      providers: [{ provide: DustbinsService, useValue: {} }],
    }).compile();

    controller = module.get<DustbinsController>(DustbinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
