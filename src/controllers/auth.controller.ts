import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { AppDataSource } from "../data-source";
import { User } from "../entity/user.entity";
import { Otp } from "../entity/otp.entity";

import { SignupDto } from "../dto/auth/signup.dto";
import { LoginDto } from "../dto/auth/login.dto";
import { ResetPasswordRequestDto } from "../dto/auth/reset-password-request.dto";
import { ResetPasswordDto } from "../dto/auth/reset-password.dto";
import { Scopes } from "../enums/otp-scopes.enum";
import { generateOtp } from "../utils/otp-genrator.util";
import moment = require("moment");

const userRepo = AppDataSource.getRepository(User);
const otpRepo = AppDataSource.getRepository(Otp);

// (Signup)
export const signup = async (req, res) =>  {
  const dto = plainToInstance(SignupDto, req.body);
  const errors = await validate(dto);

  if (errors.length > 0)
    return res.status(400).json({ message: "Validation failed", errors });

  const { firstName, lastName, email, password } = dto;

  try {
    const exists = await userRepo.findOneBy({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = userRepo.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await userRepo.save(user);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
 
// (Login)
export const login = async (req, res) => {
  const dto = plainToInstance(LoginDto, req.body);
  const errors = await validate(dto);

  if (errors.length > 0)
    return res.status(400).json({ message: "Validation failed", errors });

  const { email, password } = dto;

  try {
    const user = await userRepo.findOneBy({ email });
    if (!user)
      return res.status(404).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// reset password request
export const resetPasswordRequest = async (req, res) => {
  const dto = plainToInstance(ResetPasswordRequestDto, req.body);
  const errors = await validate(dto);

  if (errors.length > 0)
    return res.status(400).json({ message: "Validation failed", errors });

  const { email } = dto;

  try {
    const user = await userRepo.findOneBy({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User with this email not found" });

    await otpRepo.delete({
      user: { id: user.id },
      scope: Scopes.RESET_PASSWORD,
    });

    const otpValue = generateOtp();

    const otp = otpRepo.create({
      value: otpValue,
      user: user,
      scope: Scopes.RESET_PASSWORD,
      expireAt: moment().add(5, "minutes").toDate(),
    });

    await otpRepo.save(otp);

    console.log(`OTP to ${email} : ${otpValue}`);

    res.json({ message: "The verification code (OTP) has been sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  const dto = plainToInstance(ResetPasswordDto, req.body);
  const errors = await validate(dto);

  if (errors.length > 0)
    return res.status(400).json({ message: "Validation failed", errors });

  const { email, otpValue, newPassword } = dto;

  try {
    const user = await userRepo.findOneBy({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = await otpRepo.findOne({
      where: {
        user: { id: user.id },
        scope: Scopes.RESET_PASSWORD,
        value: Number(otpValue),
      },
    });
    if (!otp)
      return res.status(400).json({ message: "Invalid or expired OTP" });
    const diff = moment().diff(otp.expireAt);
    if (diff >= 5) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await userRepo.save(user);

    await otpRepo.delete({ id: otp.id });

    res.json({ message: "Password successfully changed" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while resetting the password" });
  }
};

export default {
  signup,
  login,
  resetPasswordRequest,
  resetPassword,
};
