
import { IsEmail, IsNotEmpty, IsNumberString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  otpValue: string;

  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;
}
