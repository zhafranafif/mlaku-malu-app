import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { BcryptService } from './auth/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
