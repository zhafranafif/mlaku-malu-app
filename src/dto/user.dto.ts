import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password!: string;
}

export class UserRegisterDto {
  @ApiProperty({
    example: 'fran_dev',
    description: 'Unique username for the user',
  })
  @IsNotEmpty()
  @IsString()
  username!: string;

  @ApiProperty({
    example: 'SuperSecure123',
    description: 'Password with minimum 6 characters',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'fran@example.com',
    description: 'User email address',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Zhafran Afif',
    description: 'Full name of the user',
  })
  @IsNotEmpty()
  @IsString()
  name!: string;
}
