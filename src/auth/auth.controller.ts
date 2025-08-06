import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserLoginDto, UserRegisterDto } from 'src/dto/user.dto';

import {
  CommonResponseInterface,
  RegisterInterface,
  UserLoginInterface,
} from 'src/types/auth.types';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @SkipThrottle()
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

  @Post('register')
  @SkipThrottle()
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
