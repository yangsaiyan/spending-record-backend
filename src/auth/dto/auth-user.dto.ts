import { IsString, IsEmail, IsNotEmpty, Length } from 'class-validator';

export class AuthUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
  password: string;
}
