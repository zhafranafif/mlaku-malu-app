import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { DestinationInterface } from 'src/types/destination.types';

export class UpdateCustomerDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  email?: string;
}

export class CreateCustomerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  destinations!: DestinationInterface[];
}
