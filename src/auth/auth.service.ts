import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { BcryptService } from './bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterInterface, UserLoginInterface } from 'src/types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async Login(username: string, password: string): Promise<UserLoginInterface> {
    try {
      const user = await this.prismaService.staff.findUnique({
        where: { username: username },
      });

      if (!user) {
        throw new BadRequestException('User not found');
      }

      const isPasswordValid = await this.bcryptService.comparePasswords(
        password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new BadRequestException('Invalid password');
      }

      const token = this.jwtService.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }

  async Register(
    name: string,
    username: string,
    email: string,
    password: string,
  ): Promise<RegisterInterface> {
    try {
      const hashedPassword = await this.bcryptService.hashPassword(password);
      const user = await this.prismaService.staff.create({
        data: {
          name: name,
          username: username,
          email: email,
          password: hashedPassword,
        },
      });
      return {
        username: user.username,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Internal server error');
    }
  }
}
