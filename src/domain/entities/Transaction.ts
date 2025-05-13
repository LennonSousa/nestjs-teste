import { ApiProperty } from '@nestjs/swagger';
import { uuid } from '@shared/uuid';

type TransactionType = Omit<Transaction, 'id'> & { id?: string };

export class Transaction {
  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: false,
    example: uuid(),
    required: true,
    description: 'ID of transaction',
  })
  public id!: string;

  @ApiProperty({
    type: Number,
    nullable: false,
    example: 35,
    required: true,
    description: 'Amount of transaction',
  })
  public amount!: number;

  @ApiProperty({
    type: Date,
    nullable: false,
    example: new Date(),
    required: true,
    description: 'Timestamp of transaction',
  })
  public timestamp!: Date;

  private constructor(data: TransactionType) {
    this.id = data.id ?? uuid();

    Object.entries(data).forEach(([key, value]) => (this[key] = value));

    Object.freeze(this);
  }

  static create(data: TransactionType): Transaction {
    return new Transaction(data);
  }
}
