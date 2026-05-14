import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (email, otp) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Verify Your Account",
    html: `
      <h2>Your OTP Code</h2>
      <p>${otp}</p>
      <p>This OTP expires in 5 minutes.</p>
    `,
  });
};

export default sendOTPEmail;