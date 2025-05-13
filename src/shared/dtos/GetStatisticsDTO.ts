import { ApiProperty } from '@nestjs/swagger';

export class GetStatisticsResponseDTO {
  @ApiProperty({
    type: Number,
    nullable: false,
    example: 3,
    required: true,
    description: 'Statistics count',
  })
  count!: number;

  @ApiProperty({
    type: Number,
    nullable: false,
    example: 20,
    required: true,
    description: 'Statistics sum',
  })
  sum!: number;

  @ApiProperty({
    type: Number,
    nullable: false,
    example: 18.5,
    required: true,
    description: 'Statistics average',
  })
  avg!: number;

  @ApiProperty({
    type: Number,
    nullable: false,
    example: 17,
    required: true,
    description: 'Statistics min',
  })
  min!: number;

  @ApiProperty({
    type: Number,
    nullable: false,
    example: 25,
    required: true,
    description: 'Statistics max',
  })
  max!: number;
}
