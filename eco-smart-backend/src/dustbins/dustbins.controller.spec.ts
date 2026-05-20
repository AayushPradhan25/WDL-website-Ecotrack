import { Test, TestingModule } from '@nestjs/testing';
import { DustbinsController } from './dustbins.controller';

describe('DustbinsController', () => {
  let controller: DustbinsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DustbinsController],
    }).compile();

    controller = module.get<DustbinsController>(DustbinsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
