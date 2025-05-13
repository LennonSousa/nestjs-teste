import { Test, TestingModule } from '@nestjs/testing';
import { GetStatisticsUseCase } from '@useCases/GetStatisticsUseCase';
import { TransactionRepository } from '@domain/repositories/TransactionRepository';
import { ICreateTransactionRequest } from '@shared/interfaces/ICreateTransaction';
import { Transaction } from '@domain/entities/Transaction';

describe('GetStatisticsUseCase', () => {
  let getStatisticsUseCase: GetStatisticsUseCase;
  let transactionRepository: TransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetStatisticsUseCase,
        {
          provide: TransactionRepository,
          useValue: {
            getByTimestamp: jest.fn(),
          },
        },
      ],
    }).compile();

    getStatisticsUseCase =
      module.get<GetStatisticsUseCase>(GetStatisticsUseCase);
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
  });

  it('should get stastistics transaction', async () => {
    const transactionRequest: ICreateTransactionRequest = {
      amount: 100,
      timestamp: new Date(),
    };

    const mockTransactions = [Transaction.create(transactionRequest)];

    jest
      .spyOn(transactionRepository, 'getByTimestamp')
      .mockResolvedValue(mockTransactions);

    const result = await getStatisticsUseCase.execute();

    expect(transactionRepository.getByTimestamp).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.count).toEqual(mockTransactions.length);
  });

  it('should get stastistics transaction with zero when no transactions was found', async () => {
    const mockTransactions = [];

    jest
      .spyOn(transactionRepository, 'getByTimestamp')
      .mockResolvedValue(mockTransactions);

    const result = await getStatisticsUseCase.execute();

    expect(transactionRepository.getByTimestamp).toHaveBeenCalled();
    expect(result).toBeDefined();
    expect(result.count).toEqual(0);
  });
});
