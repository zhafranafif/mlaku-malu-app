import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class DestinationUpdateDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  destination!: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @Type(() => Date)
  endDate!: Date;
}

export class DestinationCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  destination!: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  startDate!: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  endDate!: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  customerId!: number;
}

export class QueryParamDestinationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  @IsIn([
    'id',
    'customerId',
    'destination',
    'startDate',
    'endDate',
    'createdAt',
    'updatedAt',
  ])
  sortBy?: string;

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder?: string;
}
