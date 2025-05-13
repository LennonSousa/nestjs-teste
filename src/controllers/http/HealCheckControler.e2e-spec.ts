import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckController } from './HealthCheckController';

describe('HealthCheckController', () => {
  let appController: HealthCheckController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
    }).compile();

    appController = app.get<HealthCheckController>(HealthCheckController);
  });

  describe('[GET] /status', () => {
    it('should return a health check status', async () => {
      const response = await appController.healthCheck();

      expect(response.status).toBe('SERVER_IS_READY');
    });
  });
});
