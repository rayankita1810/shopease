"use client";

import { useEffect, useState } from "react";
import { getCart, updateQuantity, removeFromCart } from "@/lib/cart";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface CartItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    setCart(getCart());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-8">
      
      {/* LEFT: CART ITEMS */}
      <div className="md:col-span-2">
        <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20 border rounded-xl">
            <p className="text-gray-500 mb-4">Your cart is empty 🛒</p>
            <button
              onClick={() => router.push("/products")}
              className="bg-black text-white px-6 py-2 rounded-lg"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product}
                className="flex gap-4 border rounded-xl p-4 hover:shadow-sm transition"
              >
                {/* IMAGE */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <Image
                    src={
                      item.image ||
                      "/placeholder.png"
                    }
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                {/* DETAILS */}
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <h2 className="font-medium text-gray-900">
                      {item.name}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                      ₹{item.price}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center justify-between mt-3">
                    
                    {/* QUANTITY */}
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() => {
                          const updated = updateQuantity(item.product, -1);
                          setCart(updated);
                        }}
                        disabled={item.quantity === 1}
                        className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50"
                      >
                        -
                      </button>

                      <span className="px-4">{item.quantity}</span>

                      <button
                        onClick={() => {
                          const updated = updateQuantity(item.product, 1);
                          setCart(updated);
                        }}
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    {/* REMOVE */}
                    <button
                      onClick={() => {
                        if (confirm("Remove this item?")) {
                          const updated = removeFromCart(item.product);
                          setCart(updated);
                        }
                      }}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: SUMMARY */}
      {cart.length > 0 && (
        <div className="border rounded-xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="flex justify-between text-gray-600 mb-2">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>

          <div className="flex justify-between text-gray-600 mb-4">
            <span>Shipping</span>
            <span className="text-green-600">Free</span>
          </div>

          <div className="border-t pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={() => router.push("/checkout")}
            className="w-full mt-6 bg-black text-white py-3 rounded-lg hover:opacity-90 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}