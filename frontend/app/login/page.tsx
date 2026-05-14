"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { mergeCartAfterLogin } from "@/lib/cart";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        toast.error("No credential received");
        return;
      }

      const decoded: any = jwtDecode(credentialResponse.credential);

      const res = await API.post("/auth/google", {
        name: decoded.name,
        email: decoded.email,
        image: decoded.picture,
      });

      const { token, ...user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("userChanged"));

      toast.success("Google login successful");

      if (user.role === "admin") router.push("/admin");
      else if (user.role === "seller") router.push("/seller");
      else router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Google login failed");
    }
  };
  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
        remember,
      });

      const { token, ...user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("userChanged"));
      mergeCartAfterLogin(user._id);

      toast.success("Welcome back!");

      if (user.role === "admin") router.push("/admin");
      else if (user.role === "seller") router.push("/seller");
      else router.push("/");
    } catch (err) {
      console.error(err);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Login to your account
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Welcome back 👋</p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Email */}
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              className="peer w-full h-14 border rounded-lg px-4 pt-6 pb-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <label
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all
    peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600
    peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
            >
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

            <label
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm transition-all
    peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600
    peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs"
            >
              Password
            </label>

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {/* Remember */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember me
            </label>

            <span
              onClick={() => router.push("/forgot-password")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Forgot password?
            </span>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <div className="flex-1 h-px bg-gray-200" />
            OR
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Google */}
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => toast.error("Google Login Failed")}
          />
        </div>

        {/* Footer */}
        <p className="text-sm text-center text-gray-500 mt-6">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
