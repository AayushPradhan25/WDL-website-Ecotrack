import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            user: { findMany: jest.fn().mockResolvedValue([]) },
            complaint: { count: jest.fn().mockResolvedValue(0) },
            truck: { count: jest.fn().mockResolvedValue(0) },
            dustbin: { count: jest.fn().mockResolvedValue(0) },
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe('GET /', () => {
    it('should return health status', () => {
      const result = appController.getHello();
      expect(result).toHaveProperty('status', 'healthy');
    });
  });
});
