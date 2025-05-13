import { Transaction } from '@domain/entities/Transaction';

export interface GetByTimestamp {
  startTimestamp: Date;
  endTimestamp: Date;
}

export abstract class TransactionRepository {
  abstract create(payload: Transaction): Promise<Transaction>;
  abstract getByTimestamp(payload: GetByTimestamp): Promise<Transaction[]>;
  abstract removeAll(): Promise<void>;
}
