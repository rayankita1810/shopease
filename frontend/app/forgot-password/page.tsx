"use client";

import { useState } from "react";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);

  // Send OTP
  const handleSendOTP = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/forgot-password", {
        email,
      });

      toast.success(res.data.message);

      setStep(2);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      toast.success(res.data.message);

      router.push("/login");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Password reset failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Forgot Password
          </h1>

          <p className="text-gray-500 mt-1 text-sm">
            {step === 1
              ? "Enter your email to receive OTP"
              : "Enter OTP and new password"}
          </p>
        </div>

        <div className="space-y-5">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              value={email}
              disabled={step === 2}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="peer w-full h-14 border rounded-lg px-4 pt-6 pb-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100"
            />

            <label
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600
              peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
            >
              Email
            </label>
          </div>

          {/* Step 2 */}
          {step === 2 && (
            <>
              {/* OTP */}
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-14 border rounded-lg px-4 pt-6 pb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <label
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all
                  peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600
                  peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
                >
                  OTP
                </label>
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-14 border rounded-lg px-4 pt-6 pb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <label
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all
                  peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600
                  peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
                >
                  New Password
                </label>
              </div>
            </>
          )}

          {/* Button */}
          {step === 1 ? (
            <button
              onClick={handleSendOTP}
              disabled={loading || !email}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          ) : (
            <button
              onClick={handleResetPassword}
              disabled={
                loading || !otp || !newPassword
              }
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>
          )}

          {/* Back */}
          <button
            onClick={() => router.push("/login")}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}