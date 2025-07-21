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
    const existingOtp = await this.otpRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
      withDeleted: true,
    });

    const newOtpValue = generateOTP();

    if (existingOtp) {
      existingOtp.otp = newOtpValue;
      existingOtp.triggeredAt = new Date();
      await this.otpRepository.save(existingOtp);
      return { message: 'OTP updated successfully', otp: existingOtp.otp };
    }

    const newOtp = this.otpRepository.create({
      user,
      otp: newOtpValue,
    });

    await this.otpRepository.save(newOtp);
    return { message: 'OTP created successfully', otp: newOtp.otp };
  }

  async verifyOtp(user: User, otp: string) {
    const existingOtp = await this.otpRepository.findOne({
      where: { user: { id: user.id }, otp },
    });

    if (!existingOtp || Number(existingOtp.otp) !== Number(otp)) {
      return { message: 'Invalid OTP' };
    }

    if (existingOtp.triggeredAt < new Date(Date.now() - 10 * 60 * 1000)) {
      await this.otpRepository.softDelete(existingOtp.otpId);
      return { message: 'OTP expired' };
    }

    await this.otpRepository.softDelete(existingOtp.otp);
    await this.otpRepository.update(existingOtp.user.id, {
      deletedAt: new Date(),
    });
    return { message: 'OTP verified successfully' };
  }
}
