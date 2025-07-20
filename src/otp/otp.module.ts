import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './otp.entity';

@Module({
  controllers: [OtpController],
  providers: [OtpService],
  imports: [TypeOrmModule.forFeature([Otp])],
  exports: [OtpService],
})
export class OtpModule {}
