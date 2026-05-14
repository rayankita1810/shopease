"use client";

import { useEffect, useState } from "react";
import { getCart, saveCart } from "@/lib/cart";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import type { CartItem } from "@/types";


// Load Razorpay
const loadScript = (src: string) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setCart(getCart());
  }, []);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePayment = async () => {
    try {
      if (
        !shippingAddress.fullName ||
        !shippingAddress.phone ||
        !shippingAddress.address ||
        !shippingAddress.city ||
        !shippingAddress.postalCode
      ) {
        return toast.error("Please fill all address fields");
      }

      if (cart.length === 0) {
        return toast.error("Cart is empty");
      }

      setLoading(true);

      const res = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js",
      );

      if (!res) {
        setLoading(false);
        return toast.error("Failed to load Razorpay");
      }

      const { data } = await API.post("/payment/create-razorpay-order", {
        amount: total,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "ShopEase",
        description: "Order Payment",
        order_id: data.id,

        handler: async function (response: any) {
          try {
            // console.log("PAYMENT RESPONSE:", response);

            // console.log("STEP 1: VERIFY PAYMENT");
            await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            // console.log("VERIFY SUCCESS");

            // console.log("STEP 2: CREATE ORDER");
            await API.post("/orders", {
              orderItems: cart,
              shippingAddress,
              totalPrice: total,
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
            });
            // console.log("ORDER CREATE SUCCESS");

            saveCart([]);
            setCart([]);

            toast.success("Order placed successfully");
            router.push("/order-success");
          } catch (error: any) {
            // console.log("❌ ORDER FLOW FAILED:", error);

            // IMPORTANT: show backend message
            toast.error(error?.response?.data?.message || "Order failed");
          } finally {
            setLoading(false);
          }
        },

        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },

        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new (window as any).Razorpay(options);

      paymentObject.open();

      setLoading(false);
    } catch (error) {
      // console.log(error);
      toast.error("Payment failed");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
      {/* LEFT */}
      <div className="md:col-span-2 space-y-6">
        {/* ADDRESS */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-5">Delivery Address</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={shippingAddress.fullName}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  fullName: e.target.value,
                })
              }
              className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
            />

            <textarea
              placeholder="Full Address"
              rows={4}
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="border rounded-xl p-3 md:col-span-2 outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  city: e.target.value,
                })
              }
              className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
            />

            <input
              type="text"
              placeholder="Postal Code"
              value={shippingAddress.postalCode}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  postalCode: e.target.value,
                })
              }
              className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* ORDER ITEMS */}
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-5">Order Items</h2>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product}
                className="flex items-center justify-between border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16">
                    <Image
                      src={item.image || "/placeholder.webp"}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover rounded-lg border"
                    />
                  </div>

                  <div>
                    <p className="font-medium">{item.name}</p>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm h-fit sticky top-24">
        <h2 className="text-xl font-semibold mb-5">Order Summary</h2>

        <div className="space-y-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>

            <span className="text-green-600 font-medium">Free</span>
          </div>

          <div className="border-t pt-4 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading || cart.length === 0}
          className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 font-medium"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <p className="text-xs text-gray-500 mt-4 text-center">
          Secure payment powered by Razorpay
        </p>
      </div>
    </div>
  );
}
