import { UnprocessableEntityException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

const message = 'Amount must be a positive number';

export class NegativeAmountError extends UnprocessableEntityException {
  @ApiProperty({ example: message })
  public message: string;

  constructor() {
    super(message);
  }
}
