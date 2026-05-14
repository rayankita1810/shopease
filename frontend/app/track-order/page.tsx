"use client";

import { useState } from "react";
import API from "@/lib/api";
import Image from "next/image";
import toast from "react-hot-toast";
import { Search, PackageCheck, Truck, Clock } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  image: string;
  price: number;
}

interface OrderItem {
  _id: string;
  product?: Product;
  quantity: number;
  status?: string; // ✅ item status added
}

interface Order {
  _id: string;
  orderItems?: OrderItem[];
  totalPrice: number;
  orderStatus: string; // ✅ FIXED (was status before)
  createdAt: string;
  paymentStatus: string;
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);

  const handleTrack = async () => {
    if (!orderId.trim()) {
      return toast.error("Enter order ID");
    }

    try {
      setLoading(true);

      const { data } = await API.get(`/track-order/${orderId}`);
      setOrder(data);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Order not found");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ORDER STATUS COLOR
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "partially shipped":
        return "bg-orange-100 text-orange-700";

      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "partially cancelled":
        return "bg-orange-100 text-orange-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // ✅ ITEM STATUS COLOR
  const getItemStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "text-green-600";

      case "shipped":
        return "text-blue-600";

      case "packed":
        return "text-purple-600";

      case "pending":
        return "text-yellow-600";

      case "cancelled":
        return "text-red-600";

      default:
        return "text-gray-500";
    }
  };

  // ✅ ICON
  const getStatusIcon = () => {
    switch (order?.orderStatus?.toLowerCase()) {
      case "delivered":
        return <PackageCheck size={22} className="text-green-600" />;

      case "shipped":
        return <Truck size={22} className="text-blue-600" />;

      default:
        return <Clock size={22} className="text-yellow-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-8">Track Your Order</h1>

      {/* SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
        />

        <button
          onClick={handleTrack}
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded-xl hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Search size={18} />
          {loading ? "Tracking..." : "Track"}
        </button>
      </div>

      {/* ORDER DETAILS */}
      {order && (
        <div className="mt-8 border rounded-2xl shadow-sm bg-white overflow-hidden">
          {/* TOP */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              {getStatusIcon()}

              <div>
                <h2 className="text-2xl font-semibold">Order Found</h2>

                <p className="text-gray-500 text-sm">ID: {order._id}</p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  order.orderStatus,
                )}`}
              >
                {order.orderStatus}
              </span>

              <span className="text-sm text-gray-500">
                Ordered on {new Date(order.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* ITEMS */}
          <div className="p-6 space-y-4">
            {order?.orderItems?.length ? (
              order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-4 border rounded-xl p-4"
                >
                  <Image
                    src={item.product?.image || "/placeholder.png"}
                    alt={item.product?.name || "Product"}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {item.product?.name || "Product removed"}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>

                    <p className="text-sm font-medium mt-1">
                      ₹{item.product?.price || 0}
                    </p>

                    {/* ✅ ITEM STATUS */}
                    <p
                      className={`text-sm font-semibold mt-1 ${getItemStatusColor(
                        item.status,
                      )}`}
                    >
                      Item Status: {item.status || "Pending"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items found</p>
            )}
          </div>

          {/* FOOTER */}
          <div className="border-t bg-gray-50 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <p className="font-semibold">{order.paymentStatus}</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold">₹{order.totalPrice}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
