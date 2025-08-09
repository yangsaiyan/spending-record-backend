import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { OtpModule } from 'src/otp/otp.module';

@Module({
  imports: [
    UserModule,
    PassportModule,
    OtpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'topSecretKey',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
