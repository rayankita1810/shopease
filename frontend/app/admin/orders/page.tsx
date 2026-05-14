"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";

interface OrderItem {
  _id: string;
  quantity: number;
  status: string;

  product: {
    _id: string;
    name: string;
    image: string;
    price: number;

    seller?: {
      name: string;
      email: string;
    };
  };
}

interface Order {
  _id: string;
  totalPrice: number;
  createdAt: string;
  paymentStatus: string;

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

  orderItems: OrderItem[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrder, setOpenOrder] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      // console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const updateItemStatus = async (
    orderId: string,
    itemId: string,
    status: string,
  ) => {
    if (!confirm(`Change status to "${status}"?`)) return;

    try {
      setUpdating(true);

      await API.put(`/admin/order/${orderId}/item/${itemId}`, {
        status,
      });

      await fetchOrders();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between">
          <h1 className="text-3xl font-bold">Admin Orders</h1>
          <div className="text-lg">Revenue: ₹{totalRevenue}</div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-6">

        {loading ? (
          <p>Loading...</p>
        ) : (
          orders.map((order) => {
            const isOpen = openOrder === order._id;

            return (
              <div key={order._id} className="bg-white rounded-xl border">

                {/* ORDER HEADER */}
                <div
                  className="p-5 flex justify-between cursor-pointer"
                  onClick={() => setOpenOrder(isOpen ? null : order._id)}
                >
                  <div>
                    <h2 className="font-bold text-sm">Order #{order._id}</h2>
                    <p className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      ₹{order.totalPrice}
                    </span>
                    {isOpen ? <ChevronUp /> : <ChevronDown />}
                  </div>
                </div>

                {/* DETAILS */}
                {isOpen && (
                  <div className="p-5 space-y-6 border-t">

                    {/* BUYER INFO */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Buyer Details</h3>
                      <p>Name: {order.user.name}</p>
                      <p>Email: {order.user.email}</p>
                    </div>

                    {/* SHIPPING INFO */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.phone}</p>
                      <p>
                        {order.shippingAddress.address},{" "}
                        {order.shippingAddress.city} -{" "}
                        {order.shippingAddress.postalCode}
                      </p>
                    </div>

                    {/* ITEMS */}
                    <div className="space-y-4">
                      {order.orderItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex justify-between border rounded-lg p-4"
                        >

                          {/* LEFT */}
                          <div className="flex gap-4">
                            <Image
                              src={item.product.image}
                              alt=""
                              width={80}
                              height={80}
                              className="rounded"
                            />

                            <div>
                              <p className="font-semibold">
                                {item.product.name}
                              </p>

                              <p className="text-sm text-gray-600">
                                ₹{item.product.price} × {item.quantity}
                              </p>

                              {/* SELLER INFO */}
                              <div className="text-xs text-gray-500 mt-1">
                                <p>
                                  Seller: {item.product.seller?.name}
                                </p>
                                <p>
                                  {item.product.seller?.email}
                                </p>
                              </div>

                              <p className="text-xs mt-1">
                                Status: <b>{item.status}</b>
                              </p>
                            </div>
                          </div>

                          {/* RIGHT */}
                          <div>
                            <select
                              value={item.status}
                              disabled={updating}
                              onChange={(e) =>
                                updateItemStatus(
                                  order._id,
                                  item._id,
                                  e.target.value
                                )
                              }
                              className="border px-3 py-1 rounded text-sm"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Packed">Packed</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>

                        </div>
                      ))}
                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}