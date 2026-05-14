"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Image from "next/image";

interface OrderItem {
  _id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  status: "Pending" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
}

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentStatus: string;
  createdAt: string;
  orderItems: OrderItem[];
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 👇 track open/close orders
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/seller/orders");
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleOrder = (id: string) => {
    setOpenOrderId((prev) => (prev === id ? null : id));
  };

  const updateStatus = async (
    orderId: string,
    itemId: string,
    status: "Packed" | "Shipped",
  ) => {
    const confirmUpdate = window.confirm(
      `Are you sure you want to mark this item as "${status}"?`,
    );

    if (!confirmUpdate) return;

    try {
      await API.patch(`/seller/order/${orderId}/item/${itemId}`, { status });

      fetchOrders();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Orders</h1>
          <p className="text-gray-500 mt-2">
            Click an order to view details & manage status
          </p>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="bg-white border rounded-2xl p-10 text-center">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-semibold">No orders found</h2>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isOpen = openOrderId === order._id;

              return (
                <div
                  key={order._id}
                  className="bg-white border rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* COLLAPSE HEADER */}
                  <button
                    onClick={() => toggleOrder(order._id)}
                    className="w-full flex justify-between items-center p-5 hover:bg-gray-50 transition"
                  >
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-gray-900">
                        {order.user?.name}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>

                    <div className="text-sm text-gray-500">
                      {isOpen ? "▲ Close" : "▼ View"}
                    </div>
                  </button>

                  {/* COLLAPSIBLE BODY */}
                  {isOpen && (
                    <div className="p-5 border-t space-y-6">
                      {/* SHIPPING */}
                      <div>
                        <h3 className="font-semibold mb-2">Shipping Address</h3>

                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.fullName},{" "}
                          {order.shippingAddress.phone}
                        </p>

                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.address},{" "}
                          {order.shippingAddress.city}
                        </p>
                      </div>

                      {/* ITEMS */}
                      <div className="space-y-4">
                        {order.orderItems.map((item) => (
                          <div
                            key={item._id}
                            className="flex gap-4 border rounded-xl p-4"
                          >
                            {/* IMAGE */}
                            <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* INFO */}
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.name}</h3>

                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity} | ₹{item.price}
                              </p>

                              {/* STATUS */}
                              <div className="flex items-center gap-3 mt-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    item.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : item.status === "Packed"
                                        ? "bg-blue-100 text-blue-700"
                                        : item.status === "Shipped"
                                          ? "bg-purple-100 text-purple-700"
                                          : item.status === "Delivered"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {item.status}
                                </span>

                                {/* DROPDOWN */}
                                {item.status !== "Delivered" &&
                                  item.status !== "Cancelled" && (
                                    <select
                                      value={item.status}
                                      onChange={(e) =>
                                        updateStatus(
                                          order._id,
                                          item._id,
                                          e.target.value as
                                            | "Packed"
                                            | "Shipped",
                                        )
                                      }
                                      className="px-2 py-1 border rounded-md text-sm"
                                    >
                                      <option value="Pending">Pending</option>
                                      <option value="Packed">Packed</option>
                                      <option value="Shipped">Shipped</option>
                                    </select>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
