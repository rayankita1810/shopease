import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import generateOTP from "../utils/generateOTP.js";
import sendOTPEmail from "../utils/sendEmail.js";

// =========================
// Generate JWT Token
// =========================
const generateToken = (id, remember) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: remember ? "7d" : "1h",
  });
};

// =========================
// VERIFY OTP
// =========================
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // OTP expired
    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      token: generateToken(user._id, true),
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// REGISTER USER (SEND OTP)
// =========================
export const registerUser = async (req, res) => {
  const { name, email, password, isSeller } = req.body;

  try {
    const userExists = await User.findOne({ email });

    // Existing verified user
    if (userExists && userExists.isVerified) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Hash OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Role
    const role = isSeller ? "seller" : "user";

    // OTP Expiry (5 min)
    const otpExpire = Date.now() + 5 * 60 * 1000;

    // Existing but unverified user
    if (userExists) {
      userExists.name = name;
      userExists.password = hashedPassword;
      userExists.role = role;
      userExists.otp = hashedOtp;
      userExists.otpExpire = otpExpire;

      await userExists.save();
    } else {
      // Create temp user
      await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        otp: hashedOtp,
        otpExpire,
        isVerified: false,
      });
    }

    // Send OTP Email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to email",
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// LOGIN USER
// =========================
export const loginUser = async (req, res) => {
  const { email, password, remember } = req.body;

  try {
    const user = await User.findOne({ email });

    // User not found
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified && user.role !== "admin" && user.role !== "seller") {
      return res.status(401).json({
        message: "Please verify your email first",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      token: generateToken(user._id, remember),
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// =========================
// GOOGLE AUTH
// =========================
export const googleAuth = async (req, res) => {
  try {
    const { name, email, image } = req.body;

    let user = await User.findOne({ email });

    // Create user if not exists
    if (!user) {
      user = await User.create({
        name,
        email,
        image,
        password: "google-auth-user",
        role: "user",
        isVerified: true,
      });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      token: generateToken(user._id, true),
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      message: "Google authentication failed",
    });
  }
};

// =========================
// BECOME SELLER
// =========================
export const becomeSeller = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Already seller
    if (user.role === "seller") {
      return res.status(400).json({
        message: "Already a seller",
      });
    }

    user.role = "seller";

    await user.save();

    res.status(200).json({
      message: "Seller account activated",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      token: generateToken(user._id, true),
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      message: "Failed to become seller",
    });
  }
};
// =========================
// FORGOT PASSWORD (SEND OTP)
// =========================
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    // User not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Hash OTP
    const hashedOtp = await bcrypt.hash(otp, 10);

    // Save OTP
    user.otp = hashedOtp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 min

    await user.save();

    // Send Email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: "Password reset OTP sent to email",
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// =========================
// RESET PASSWORD
// =========================
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    // User not found
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // OTP expired
    if (!user.otpExpire || user.otpExpire < Date.now()) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    // Compare OTP
    const isMatch = await bcrypt.compare(otp, user.otp);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;

    // Clear OTP
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    // console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};