import { TransactionGateway } from '@controllers/event/TransactionGateway';
import { TransactionRepository } from '@domain/repositories/TransactionRepository';
import { Injectable } from '@nestjs/common';
import { Logger } from '@shared/logger';
import { GetStatisticsUseCase } from '@useCases/GetStatisticsUseCase';

@Injectable()
export class DeleteAllTransactionsUseCase {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
    private readonly transactionGateway: TransactionGateway,
  ) {}

  async execute(): Promise<void> {
    this.logger.log('Trying to remove all Transactions');

    await this.transactionRepository.removeAll();

    this.logger.log('All Transactions was removed');

    const statistics = await this.getStatisticsUseCase.execute();

    this.transactionGateway.sendStatistics(statistics);
  }
}
