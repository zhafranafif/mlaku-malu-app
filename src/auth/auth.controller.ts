import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Request,
  Res,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiResponse } from '@nestjs/swagger';
import { UserLoginDto, UserRegisterDto } from 'src/dto/user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Role } from '@prisma/client';
import {
  CommonResponseInterface,
  RegisterInterface,
  UserLoginInterface,
} from 'src/types/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  async Login(
    @Body() { username, password }: UserLoginDto,
  ): Promise<CommonResponseInterface<UserLoginInterface>> {
    const token = await this.authService.Login(username, password);
    return {
      code: HttpStatus.OK,
      message: 'User logged in successfully.',
      data: token,
    };
  }

  @Post('Register')
  async Register(
    @Body() { name, username, email, password }: UserRegisterDto,
  ): Promise<CommonResponseInterface<RegisterInterface>> {
    const data = await this.authService.Register(
      name,
      username,
      email,
      password,
    );
    return {
      code: HttpStatus.OK,
      message: 'User registered successfully.',
      data: data,
    };
  }
}
