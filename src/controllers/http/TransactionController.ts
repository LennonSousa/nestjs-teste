import { Transaction } from '@domain/entities/Transaction';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiUnprocessableEntityResponse,
  refs,
} from '@nestjs/swagger';
import { CreateTransactionBodyDTO } from '@shared/dtos/CreateTransactionDTO';
import { GetStatisticsResponseDTO } from '@shared/dtos/GetStatisticsDTO';
import { FutureTimestampError } from '@shared/errors/FutureTimestampError';
import { NegativeAmountError } from '@shared/errors/NegativeAmountError';
import { CreateTransactionUseCase } from '@useCases/CreateTransactionUseCase';
import { DeleteAllTransactionsUseCase } from '@useCases/DeleteAllTransactionsUseCase';
import { GetStatisticsUseCase } from '@useCases/GetStatisticsUseCase';

@Controller()
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
    private readonly deleteAllTransactionsUseCase: DeleteAllTransactionsUseCase,
  ) {}

  @Post('transactions')
  @ApiOperation({
    description: 'Create transaction',
  })
  @ApiCreatedResponse({ type: Transaction })
  @ApiExtraModels(
    NegativeAmountError,
    FutureTimestampError,
    BadRequestException,
  )
  @ApiUnprocessableEntityResponse({
    schema: {
      anyOf: refs(NegativeAmountError, FutureTimestampError),
    },
  })
  @ApiBadRequestResponse({
    type: BadRequestException,
    example: new BadRequestException(),
  })
  async createTransaction(
    @Body() { amount, timestamp }: CreateTransactionBodyDTO,
  ): Promise<Transaction> {
    return await this.createTransactionUseCase.execute({
      amount,
      timestamp: new Date(timestamp),
    });
  }

  @Get('statistics')
  @ApiOperation({
    description: 'Transaction statistics',
  })
  @ApiOkResponse({
    type: GetStatisticsResponseDTO,
  })
  async getStatistics(): Promise<GetStatisticsResponseDTO> {
    return await this.getStatisticsUseCase.execute();
  }

  @Delete('transactions')
  @ApiOkResponse({
    description: 'All transactions deleted.',
  })
  async deleteAllTransactions(): Promise<void> {
    return await this.deleteAllTransactionsUseCase.execute();
  }
}
