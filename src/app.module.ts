import { Module } from '@nestjs/common';
import { TransactionRepository } from '@domain/repositories/TransactionRepository';
import { InMemoryTransactionRepository } from '@external/repositories/InMemoryTransactionRepository';
import { CreateTransactionUseCase } from '@useCases/CreateTransactionUseCase';
import { DeleteAllTransactionsUseCase } from '@useCases/DeleteAllTransactionsUseCase';
import { GetStatisticsUseCase } from '@useCases/GetStatisticsUseCase';
import { TransactionController } from '@controllers/http/TransactionController';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TransactionGateway } from '@controllers/event/TransactionGateway';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 60,
        },
      ],
    }),
  ],
  controllers: [TransactionController],
  providers: [
    {
      provide: TransactionRepository,
      useClass: InMemoryTransactionRepository,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    GetStatisticsUseCase,
    TransactionGateway,
  ],
})
export class AppModule {}
