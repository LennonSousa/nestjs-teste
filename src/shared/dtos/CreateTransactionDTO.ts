import { ApiProperty } from '@nestjs/swagger';
import { IsPastDate } from '@shared/validators/IsPastDate';
import {
  IsDateString,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreateTransactionBodyDTO {
  @ApiProperty({
    type: Number,
    nullable: false,
    example: 35.6,
    required: true,
    description: 'Amount of transaction',
  })
  @IsNotEmpty()
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @IsPositive()
  amount!: number;

  @ApiProperty({
    type: Date,
    nullable: false,
    example: new Date(),
    required: true,
    description: 'Timestamp of transaction',
  })
  @IsNotEmpty()
  @IsDateString()
  @IsISO8601()
  @IsPastDate('timestamp')
  timestamp!: Date;
}
