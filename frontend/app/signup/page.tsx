"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const [isSeller, setIsSeller] = useState(false);
  const [show, setShow] = useState(false);

  const [loading, setLoading] = useState(false);

  // ✅ show otp screen
  const [otpSent, setOtpSent] = useState(false);

  // =========================
  // SEND OTP
  // =========================
  const handleSignup = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        isSeller,
      });

      toast.success(res.data.message || "OTP sent to email");

      setOtpSent(true);
    } catch (err: any) {
      console.error(err);

      toast.error(err?.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      // save auth
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      window.dispatchEvent(new Event("userChanged"));

      toast.success("Account verified successfully!");

      if (res.data.role === "seller") {
        router.push("/seller");
      } else {
        router.push("/products");
      }
    } catch (err: any) {
      console.error(err);

      toast.error(err?.response?.data?.message || "Invalid OTP");
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
            {otpSent ? "Verify OTP" : "Create Account"}
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            {otpSent
              ? `Enter OTP sent to ${email}`
              : "Join our marketplace 🚀"}
          </p>
        </div>

        {/* ========================= */}
        {/* SIGNUP FORM */}
        {/* ========================= */}
        {!otpSent ? (
          <div className="space-y-5">
            
            {/* Name */}
            <div className="relative">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=" "
                className="peer w-full h-14 border rounded-lg px-4 pt-6 pb-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600
              peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs">
                Name
              </label>
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                className="peer w-full h-14 border rounded-lg px-4 pt-6 pb-2 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600
              peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs">
                Email
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                className="peer w-full h-14 border rounded-lg px-4 pt-6 pb-2 pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all
              peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600
              peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs">
                Password
              </label>

              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Seller Toggle */}
            <div className="flex items-center justify-between border rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">
                  Register as Seller
                </p>

                <p className="text-xs text-gray-500">
                  Sell your products on the platform
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSeller(!isSeller)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                  isSeller ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow transform transition ${
                    isSeller ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </div>

            {/* Signup Button */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Continue"}
            </button>
          </div>
        ) : (
          
          /* ========================= */
          /* OTP FORM */
          /* ========================= */
          <div className="space-y-5">

            <div className="relative">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder=" "
                maxLength={6}
                className="peer w-full h-14 border rounded-lg px-4 pt-6 pb-2 text-center tracking-[10px] text-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <label className="absolute left-4 top-2 text-xs text-blue-600">
                Enter OTP
              </label>
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              onClick={() => setOtpSent(false)}
              className="w-full text-sm text-gray-500 hover:text-blue-600"
            >
              Change Email
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}