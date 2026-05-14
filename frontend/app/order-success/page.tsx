"use client";

import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border shadow-md rounded-2xl p-8 max-w-md w-full text-center">
        
        {/* ICON */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500" size={60} />
        </div>

        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-gray-900">
          Payment Successful!
        </h1>

        {/* SUBTEXT */}
        <p className="text-gray-500 mt-2 text-sm">
          Your order has been placed successfully 🎉
        </p>

        {/* ORDER INFO */}
        <div className="bg-gray-50 border rounded-lg p-4 mt-6 text-sm text-left">
          <p className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <span className="text-green-600 font-medium">Confirmed</span>
          </p>

          <p className="flex justify-between mt-2">
            <span className="text-gray-500">Estimated Delivery</span>
            <span className="font-medium">3-5 days</span>
          </p>
        </div>

        {/* ACTIONS */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => router.push("/orders")}
            className="w-full border py-3 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            View My Orders
          </button>

          <button
            onClick={() => router.push("/products")}
            className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90 transition font-medium"
          >
            Continue Shopping
          </button>
        </div>

        {/* FOOTER */}
        <p className="text-xs text-gray-400 mt-5">
          Thank you for shopping with us ❤️
        </p>
      </div>
    </div>
  );
}