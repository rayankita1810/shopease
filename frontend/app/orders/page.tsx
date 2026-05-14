"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Product {
  name: string;
  price: number;
  image: string;
}

interface OrderItem {
  product: Product;
  quantity: number;
  status: string; // ✅ ADD THIS
}

interface Order {
  _id: string;
  orderItems: OrderItem[];
  totalPrice: number;
  createdAt: string;
  orderStatus: string;
  paymentStatus: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders/my");
        setOrders(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  const getOrderStatusColor = (status: string) => {
    if (status === "Processing") return "bg-yellow-100 text-yellow-700";

    if (status === "Partially Shipped") return "bg-orange-100 text-orange-700";

    if (status === "Shipped") return "bg-blue-100 text-blue-700";

    if (status === "Delivered") return "bg-green-100 text-green-700";

    if (status === "Cancelled") return "bg-red-100 text-red-700";

    // ✅ ADD THIS
    if (status === "Partially Cancelled") return "bg-red-100 text-orange-700";

    return "bg-gray-100 text-gray-600";
  };

  const getItemStatusColor = (status: string) => {
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";

    if (status === "Packed") return "bg-purple-100 text-purple-700";

    if (status === "Shipped") return "bg-blue-100 text-blue-700";

    if (status === "Delivered") return "bg-green-100 text-green-700";

    if (status === "Cancelled") return "bg-red-100 text-red-700";

    return "bg-gray-100 text-gray-600";
  };

  const getPaymentColor = (status: string) => {
    if (status === "Paid") return "text-green-600";
    if (status === "Failed") return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 border rounded-xl bg-white">
          <p className="text-gray-500 mb-4">
            You haven’t placed any orders yet
          </p>
          <button
            className="bg-black text-white px-5 py-2 rounded-lg cursor-pointer"
            onClick={() => router.push("/products")}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-xl shadow-sm overflow-hidden"
            >
              {/* TOP BAR */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 px-5 py-4 border-b bg-gray-50">
                <div className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full font-medium ${getOrderStatusColor(
                      order.orderStatus,
                    )}`}
                  >
                    {order.orderStatus}
                  </span>

                  <span
                    className={`font-medium ${getPaymentColor(order.paymentStatus)}`}
                  >
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>
              </div>

              {/* ITEMS */}
              <div className="p-5 space-y-4">
                {order.orderItems.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    {/* LEFT */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg border"
                        />
                      </div>

                      <div>
                        <p className="font-medium text-gray-900">
                          {item.product.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>

                        {/* ✅ ITEM STATUS */}
                        <p
                          className={`text-xs font-medium ${getItemStatusColor(item.status)}`}
                        >
                          Item Status: {item.status}
                        </p>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <p className="font-semibold text-gray-900">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>

              {/* FOOTER */}
              <div className="px-5 py-4 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Order ID: {order._id}
                </span>

                <span className="font-bold text-lg">₹{order.totalPrice}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
