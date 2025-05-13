import { Test, TestingModule } from '@nestjs/testing';
import { CreateTransactionUseCase } from '@useCases/CreateTransactionUseCase';
import { TransactionRepository } from '@domain/repositories/TransactionRepository';
import { GetStatisticsUseCase } from '@useCases/GetStatisticsUseCase';
import { TransactionGateway } from '@controllers/event/TransactionGateway';
import { ICreateTransactionRequest } from '@shared/interfaces/ICreateTransaction';
import { Transaction } from '@domain/entities/Transaction';
import { addSeconds } from 'date-fns';

describe('CreateTransactionUseCase', () => {
  let createTransactionUseCase: CreateTransactionUseCase;
  let transactionRepository: TransactionRepository;
  let getStatisticsUseCase: GetStatisticsUseCase;
  let transactionGateway: TransactionGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionUseCase,
        {
          provide: TransactionRepository,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: GetStatisticsUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: TransactionGateway,
          useValue: {
            sendStatistics: jest.fn(),
          },
        },
      ],
    }).compile();

    createTransactionUseCase = module.get<CreateTransactionUseCase>(
      CreateTransactionUseCase,
    );
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    getStatisticsUseCase =
      module.get<GetStatisticsUseCase>(GetStatisticsUseCase);
    transactionGateway = module.get<TransactionGateway>(TransactionGateway);
  });

  it('should create a transaction and send statistics', async () => {
    const request: ICreateTransactionRequest = {
      amount: 100,
      timestamp: new Date(),
    };
    const statisticsMocked = { count: 1, sum: 100, avg: 2, max: 3, min: 1 };

    const mockTransaction = Transaction.create(request);

    jest
      .spyOn(transactionRepository, 'create')
      .mockResolvedValue(mockTransaction);
    jest
      .spyOn(getStatisticsUseCase, 'execute')
      .mockResolvedValue(statisticsMocked);

    const result = await createTransactionUseCase.execute(request);

    expect(transactionRepository.create).toHaveBeenCalledWith(
      expect.objectContaining(request),
    );
    expect(getStatisticsUseCase.execute).toHaveBeenCalled();
    expect(transactionGateway.sendStatistics).toHaveBeenCalledWith(
      statisticsMocked,
    );
    expect(result).toEqual(mockTransaction);
  });

  it('should not create a transaction when a negative amount was sent', async () => {
    const request: ICreateTransactionRequest = {
      amount: -1,
      timestamp: new Date(),
    };

    await expect(createTransactionUseCase.execute(request)).rejects.toThrow();

    expect(transactionRepository.create).not.toHaveBeenCalled();
    expect(getStatisticsUseCase.execute).not.toHaveBeenCalled();
    expect(transactionGateway.sendStatistics).not.toHaveBeenCalledWith();
  });

  it('should not create a transaction when a future timestamp was sent', async () => {
    const request: ICreateTransactionRequest = {
      amount: 1,
      timestamp: addSeconds(new Date(), 5),
    };

    await expect(createTransactionUseCase.execute(request)).rejects.toThrow();

    expect(transactionRepository.create).not.toHaveBeenCalled();
    expect(getStatisticsUseCase.execute).not.toHaveBeenCalled();
    expect(transactionGateway.sendStatistics).not.toHaveBeenCalledWith();
  });
});
