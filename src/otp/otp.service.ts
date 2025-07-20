import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './otp.entity';
import { User } from '../user/user.entity';
import { generateOTP } from '../../utils/generators';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
  ) {}

  async createOtp(user: User) {
    const otp = this.otpRepository.create({ user, otp: generateOTP() });
    await this.otpRepository.save(otp);
    await this.otpRepository.update(otp.user.id, { triggeredAt: new Date() });
    return { message: 'OTP created successfully', otp: otp.otp };
  }

  async verifyOtp(user: User, otp: string) {
    const otpEntity = await this.otpRepository.findOne({
      where: { user, otp },
    });
    if (!otpEntity || otpEntity.otp !== otp) {
      return { message: 'Invalid OTP' };
    }

    if (otpEntity.triggeredAt < new Date(Date.now() - 10 * 60 * 1000)) {
      await this.otpRepository.softDelete(otpEntity.otp);
      return { message: 'OTP expired' };
    }

    await this.otpRepository.softDelete(otpEntity.otp);
    return { message: 'OTP verified successfully' };
  }
}
