import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { addSeconds } from 'date-fns';

describe('TransactionController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('[POST] /transactions', () => {
    it('should create a transaction', async () => {
      const transactionData = {
        amount: 100,
        timestamp: new Date().toISOString(),
      };

      const response = await request(app.getHttpServer())
        .post('/transactions')
        .send(transactionData)
        .expect(201);

      expect(response.body).toEqual(expect.objectContaining(transactionData));
    });

    it('should return 422 http status when negative number is sent', async () => {
      const transactionData = {
        amount: -1,
        timestamp: new Date().toISOString(),
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .send(transactionData)
        .expect(422);
    });

    it('should return 422 http status when past timestamp is sent', async () => {
      const transactionData = {
        amount: 1,
        timestamp: addSeconds(new Date(), 5),
      };

      await request(app.getHttpServer())
        .post('/transactions')
        .send(transactionData)
        .expect(422);
    });
  });

  describe('[GET] /statistics', () => {
    it('should get a statistics transactions', async () => {
      const transactionData = {
        amount: 100,
        timestamp: new Date().toISOString(),
      };

      const createResponse = await request(app.getHttpServer())
        .post('/transactions')
        .send(transactionData)
        .expect(201);

      expect(createResponse.body).toEqual(
        expect.objectContaining(transactionData),
      );

      const response = await request(app.getHttpServer())
        .get('/statistics')
        .send()
        .expect(200);

      expect(response.body.avg).toBeGreaterThan(0);
      expect(response.body.count).toBeGreaterThan(0);
      expect(response.body.max).toBeGreaterThan(0);
      expect(response.body.min).toBeGreaterThan(0);
      expect(response.body.sum).toBeGreaterThan(0);
    });

    it('should get a zero value statistics transactions when transactions was not found', async () => {
      await request(app.getHttpServer()).delete('/transactions').expect(200);

      const response = await request(app.getHttpServer())
        .get('/statistics')
        .send()
        .expect(200);

      expect(response.body.avg).toEqual(0);
      expect(response.body.count).toEqual(0);
      expect(response.body.max).toEqual(0);
      expect(response.body.min).toEqual(0);
      expect(response.body.sum).toEqual(0);
    });
  });

  describe('[DELETE] /transactions', () => {
    it('should remove all transactions', async () => {
      const transactionData = {
        amount: 100,
        timestamp: new Date().toISOString(),
      };

      const createResponse = await request(app.getHttpServer())
        .post('/transactions')
        .send(transactionData)
        .expect(201);

      expect(createResponse.body).toEqual(
        expect.objectContaining(transactionData),
      );

      const beforeResponse = await request(app.getHttpServer())
        .get('/statistics')
        .send()
        .expect(200);

      expect(beforeResponse.body.avg).toBeGreaterThan(0);
      expect(beforeResponse.body.count).toBeGreaterThan(0);
      expect(beforeResponse.body.max).toBeGreaterThan(0);
      expect(beforeResponse.body.min).toBeGreaterThan(0);
      expect(beforeResponse.body.sum).toBeGreaterThan(0);

      await request(app.getHttpServer())
        .delete('/transactions')
        .send()
        .expect(200);

      const afterResponse = await request(app.getHttpServer())
        .get('/statistics')
        .send()
        .expect(200);

      expect(afterResponse.body.avg).toEqual(0);
      expect(afterResponse.body.count).toEqual(0);
      expect(afterResponse.body.max).toEqual(0);
      expect(afterResponse.body.min).toEqual(0);
      expect(afterResponse.body.sum).toEqual(0);
    });
  });
});
