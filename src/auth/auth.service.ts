import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { AuthUserDto } from './dto/auth-user.dto';
import { generateOTP, generateRandomPassword } from '../../utils/generators';
import { sendEmail } from '../../utils/mail';
import { OtpService } from 'src/otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  private signToken(user: User): string {
    const payload = { sub: user.id, email: user.email };
    return this.jwtService.sign(payload);
  }

  async register(authUserDto: AuthUserDto) {
    // Check if email and password are provided
    if (!authUserDto.email || !authUserDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Check if user already exists
    const checkUser = await this.userService.findByEmail(authUserDto.email);
    if (checkUser) {
      throw new UnauthorizedException('User already exists');
    }
    const hashed = await bcrypt.hash(authUserDto.password, 10);
    const user = await this.userService.createUser({
      email: authUserDto.email,
      password: hashed,
    });
    return {
      access_token: this.signToken(user),
    };
  }

  async login(authUserDto: AuthUserDto) {
    // Check if email and password are provided
    if (!authUserDto.email || !authUserDto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    // Check if user exists and password is correct
    const user = await this.userService.findByEmail(authUserDto.email);
    if (!user || !(await bcrypt.compare(authUserDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      access_token: this.signToken(user),
    };
  }

  async sendOTPEmail(email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const otpCreation = await this.otpService.createOtp(user);
    if (
      otpCreation.message === 'OTP created successfully' ||
      otpCreation.message === 'OTP updated successfully'
    ) {
      sendEmail(
        email,
        'OTP for password reset',
        `Your OTP is <b>${otpCreation.otp}</b>`,
      );
      return { message: 'OTP sent successfully' };
    }
    throw new UnauthorizedException('Failed to send OTP');
  }

  async resetPassword(email: string, otp: string) {
    // Check if user exists
    const thisUser = await this.userService.findByEmail(email);
    if (!thisUser) {
      throw new UnauthorizedException('User not found');
    }
    const otpVerification = await this.otpService.verifyOtp(thisUser, otp);
    if (otpVerification.message !== 'OTP verified successfully') {
      throw new UnauthorizedException(otpVerification.message);
    }
    const password = generateRandomPassword();
    const hashed = await bcrypt.hash(password, 10);
    await this.userService.updateUser(thisUser.id, { password: hashed });
    sendEmail(
      thisUser.email,
      'Reset Password',
      `Your new password is <b>${password}</b>`,
    );
    return { message: 'Password reset successfully' };
  }

  async selfResetPassword(
    email: string,
    oldPassword: string,
    password: string,
  ) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new UnauthorizedException('Incorrect old password');
    }
    const hashed = await bcrypt.hash(password, 10);
    await this.userService.updateUser(user.id, { password: hashed });
    return { message: 'Password reset successfully' };
  }
}
