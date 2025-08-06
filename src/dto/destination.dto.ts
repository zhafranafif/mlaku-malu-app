import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Status } from '@prisma/client';

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

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(Status)
  status!: Status;
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
  @IsEnum(Status)
  status?: Status;

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

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 5;
}
