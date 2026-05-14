"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import toast from "react-hot-toast";

export default function BecomeSellerPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleBecomeSeller = async () => {
    try {
      setLoading(true);

      const res = await API.put("/auth/become-seller");

      const updatedUser = res.data;

      localStorage.setItem("user", JSON.stringify(updatedUser));

      localStorage.setItem("token", updatedUser.token);

      window.dispatchEvent(new Event("userChanged"));

      toast.success("You are now a seller 🎉");

      router.push("/seller");
    } catch (error: any) {
      // console.log(error);

      toast.error(error?.response?.data?.message || "Failed to become seller");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md border p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Become a Seller
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Start selling products on our marketplace and manage your own store.
        </p>

        <div className="space-y-4 text-sm text-gray-700 mb-8">
          <div className="border rounded-lg p-4">
            ✅ Upload unlimited products
          </div>

          <div className="border rounded-lg p-4">
            ✅ Manage orders and inventory
          </div>

          <div className="border rounded-lg p-4">
            ✅ Track sales performance
          </div>
        </div>

        <button
          onClick={handleBecomeSeller}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition disabled:opacity-50"
        >
          {loading ? "Processing..." : "Become Seller"}
        </button>
      </div>
    </div>
  );
}
