export function generateOtp() : number {
  const defaultOtp = process.env.DEFAULT_OTP ?? "111111";

  const otpValue =
    process.env.NODE_ENV === "dev"
      ? Number(defaultOtp)
      : Math.floor(100000 + Math.random() * 900000);

  return otpValue;
}
