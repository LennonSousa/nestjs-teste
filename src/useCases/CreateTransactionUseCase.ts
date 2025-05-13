import { Transaction } from '@domain/entities/Transaction';
import { TransactionRepository } from '@domain/repositories/TransactionRepository';
import { Injectable } from '@nestjs/common';
import { ICreateTransactionRequest } from '@shared/interfaces/ICreateTransaction';
import { GetStatisticsUseCase } from '@useCases/GetStatisticsUseCase';
import { TransactionGateway } from '@controllers/event/TransactionGateway';
import { NegativeAmountError } from '@shared/errors/NegativeAmountError';
import { isFuture } from 'date-fns';
import { FutureTimestampError } from '@shared/errors/FutureTimestampError';
import { Logger } from '@shared/logger';

@Injectable()
export class CreateTransactionUseCase {
  private logger: Logger = new Logger(this.constructor.name);

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
    private readonly transactionGateway: TransactionGateway,
  ) {}

  async execute({
    amount,
    timestamp,
  }: ICreateTransactionRequest): Promise<Transaction> {
    this.logger.log('Trying to create a Transaction', { amount, timestamp });
    if (amount < 0) {
      const error = new NegativeAmountError();

      this.logger.warn(error.message);

      throw error;
    }

    if (isFuture(new Date(timestamp))) {
      const error = new FutureTimestampError();

      this.logger.warn(error.message);

      throw error;
    }

    const transaction = Transaction.create({
      amount,
      timestamp,
    });

    this.logger.log('Transaction to create', transaction);

    const newTransaction = await this.transactionRepository.create(transaction);

    this.logger.log('Transaction created', newTransaction);

    const statistics = await this.getStatisticsUseCase.execute();

    this.transactionGateway.sendStatistics(statistics);

    return newTransaction;
  }
}
