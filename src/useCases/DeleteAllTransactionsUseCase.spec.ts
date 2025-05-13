import { Test, TestingModule } from '@nestjs/testing';
import { DeleteAllTransactionsUseCase } from '@useCases/DeleteAllTransactionsUseCase';
import { TransactionRepository } from '@domain/repositories/TransactionRepository';
import { GetStatisticsUseCase } from '@useCases/GetStatisticsUseCase';
import { TransactionGateway } from '@controllers/event/TransactionGateway';

describe('DeleteAllTransactionsUseCase', () => {
  let deleteAllTransactionsUseCase: DeleteAllTransactionsUseCase;

  let transactionRepository: TransactionRepository;
  let getStatisticsUseCase: GetStatisticsUseCase;
  let transactionGateway: TransactionGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteAllTransactionsUseCase,
        {
          provide: TransactionRepository,
          useValue: {
            removeAll: jest.fn(),
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

    deleteAllTransactionsUseCase = module.get<DeleteAllTransactionsUseCase>(
      DeleteAllTransactionsUseCase,
    );
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
    getStatisticsUseCase =
      module.get<GetStatisticsUseCase>(GetStatisticsUseCase);
    transactionGateway = module.get<TransactionGateway>(TransactionGateway);
  });

  it('should delete al transactions and send statistics', async () => {
    const statisticsMocked = { count: 1, sum: 100, avg: 2, max: 3, min: 1 };

    jest.spyOn(transactionRepository, 'removeAll').mockResolvedValue();
    jest
      .spyOn(getStatisticsUseCase, 'execute')
      .mockResolvedValue(statisticsMocked);

    await deleteAllTransactionsUseCase.execute();

    expect(transactionRepository.removeAll).toHaveBeenCalled();
    expect(getStatisticsUseCase.execute).toHaveBeenCalled();
    expect(transactionGateway.sendStatistics).toHaveBeenCalledWith(
      statisticsMocked,
    );
  });
});
