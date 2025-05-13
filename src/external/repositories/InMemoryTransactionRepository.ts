import { Transaction } from '@domain/entities/Transaction';
import {
  GetByTimestamp,
  TransactionRepository,
} from '@domain/repositories/TransactionRepository';

export class InMemoryTransactionRepository implements TransactionRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  async create(payload: Transaction): Promise<Transaction> {
    const lastIndex = this.transactions.push(payload);

    return this.transactions[lastIndex - 1];
  }

  async getByTimestamp({
    endTimestamp,
    startTimestamp,
  }: GetByTimestamp): Promise<Transaction[]> {
    const transactions = this.transactions.filter(
      (transaction) =>
        transaction.timestamp >= startTimestamp &&
        transaction.timestamp <= endTimestamp,
    );

    return transactions;
  }

  async removeAll(): Promise<void> {
    this.transactions.splice(0, this.transactions.length);
  }
}
