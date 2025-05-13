import { TransactionRepository } from '@domain/repositories/TransactionRepository';
import { Injectable } from '@nestjs/common';
import { IGetStatisticsResponse } from '@shared/interfaces/IGetStatistics';
import { Logger } from '@shared/logger';
import { subSeconds } from 'date-fns';

@Injectable()
export class GetStatisticsUseCase {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(): Promise<IGetStatisticsResponse> {
    const startTimestamp = subSeconds(new Date(), 60);
    const endTimestamp = new Date();

    this.logger.log('Trying get stastistics Transactions', {
      startTimestamp,
      endTimestamp,
    });

    const transactions = await this.transactionRepository.getByTimestamp({
      startTimestamp,
      endTimestamp,
    });

    this.logger.log('Transactions found', { amoun: transactions.length });

    const count = transactions.length;
    const amounts = transactions.map((transaction) => transaction.amount) || [];

    const sum = amounts.reduce(
      (preSum, currentValue) => preSum + currentValue,
      0,
    );

    const avg = !!amounts.length ? sum / count : 0;

    return {
      avg,
      count: transactions.length,
      max: !!amounts.length ? Math.max(...amounts) : 0,
      min: !!amounts.length ? Math.min(...amounts) : 0,
      sum,
    };
  }
}
