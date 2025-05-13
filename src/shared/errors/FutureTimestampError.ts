import { UnprocessableEntityException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

const message = 'Timestamp must be in the past';

export class FutureTimestampError extends UnprocessableEntityException {
  @ApiProperty({ example: message })
  public message: string;

  constructor() {
    super(message);
  }
}
