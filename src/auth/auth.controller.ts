import { Controller, Post, Body, Res, Query } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dto/auth-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // API(/auth/register)
  @Post('register')
  async register(
    @Body() body: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.register(body);
    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 1000,
    });
    return { message: 'User registered' };
  }

  // API(/auth/login)
  @Post('login')
  async login(
    @Body() body: AuthUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token } = await this.authService.login(body);
    res.cookie('jwt', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 1000,
    });
    return { message: 'Logged in' };
  }

  // API(/auth/logout)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logged out' };
  }

  // API(/auth/send-otp)
  @Post('send-otp')
  async sendOtp(@Body() body: AuthUserDto) {
    await this.authService.sendOTPEmail(body.email);
    return { message: 'OTP sent successfully' };
  }

  // API(/auth/reset)
  @Post('reset')
  async reset(@Body() body: AuthUserDto, @Query('otp') otp: string) {
    await this.authService.resetPassword(body, otp);
    return { message: 'Password reset successfully' };
  }
}
