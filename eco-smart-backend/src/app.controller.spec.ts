import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { PrismaService } from './prisma.service';

describe('AppController', () => {
  let appController: AppController;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn().mockResolvedValue([]),
              create: jest.fn().mockResolvedValue({ id: 1, email: 'test@test.com', name: 'Test' }),
            },
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      const result = await appController.getUsers();
      expect(result).toEqual([]);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });
});