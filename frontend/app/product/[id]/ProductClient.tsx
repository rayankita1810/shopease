"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { addToCart } from "@/lib/cart";
import Image from "next/image";
import toast from "react-hot-toast";

import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock?: number;
  category?: string;
}

export default function ProductClient({
  id,
}: {
  id: string;
}) {
  const [product, setProduct] =
    useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);

        setProduct(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-10">
          <p className="text-gray-500">
            Loading product...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* IMAGE SECTION */}
            <div className="p-5 lg:p-8 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="bg-[#f8f8f8] rounded-2xl overflow-hidden relative h-[350px] md:h-[500px]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain p-8 hover:scale-105 transition duration-500"
                />

                <div className="absolute top-4 left-4">
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md">
                    DEAL
                  </span>
                </div>
              </div>
            </div>

            {/* DETAILS */}
            <div className="p-5 lg:p-8 flex flex-col">
              {product.category && (
                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                  {product.category}
                </p>
              )}

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 leading-tight">
                {product.name}
              </h1>

              {/* RATING */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((item) => (
                    <Star
                      key={item}
                      size={16}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}

                  <Star
                    size={16}
                    className="text-gray-300"
                  />
                </div>

                <span className="text-sm text-blue-600 font-medium">
                  1,248 ratings
                </span>
              </div>

              {/* PRICE */}
              <div className="mt-5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>

                  <span className="text-lg text-gray-400 line-through">
                    ₹
                    {(
                      product.price + 1200
                    ).toLocaleString()}
                  </span>

                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md">
                    Save ₹1200
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Inclusive of all taxes
                </p>
              </div>

              {/* STOCK */}
              {product.stock !== undefined && (
                <div className="mt-5">
                  {product.stock > 0 ? (
                    <p className="text-green-600 font-semibold text-sm">
                      In Stock ({product.stock} left)
                    </p>
                  ) : (
                    <p className="text-red-500 font-semibold text-sm">
                      Out of Stock
                    </p>
                  )}
                </div>
              )}

              {/* DESCRIPTION */}
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h2>

                <p className="text-gray-600 leading-7 text-sm md:text-base">
                  {product.description}
                </p>
              </div>

              {/* FEATURES */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-8">
                <div className="border border-gray-200 rounded-xl p-4">
                  <Truck
                    size={20}
                    className="text-amber-500 mb-2"
                  />

                  <p className="text-sm font-semibold">
                    Free Delivery
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    On orders above ₹499
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <RotateCcw
                    size={20}
                    className="text-amber-500 mb-2"
                  />

                  <p className="text-sm font-semibold">
                    Easy Returns
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    7 day return policy
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4">
                  <ShieldCheck
                    size={20}
                    className="text-amber-500 mb-2"
                  />

                  <p className="text-sm font-semibold">
                    Secure Payment
                  </p>

                  <p className="text-xs text-gray-500 mt-1">
                    100% protected checkout
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  aria-label="Add product to cart"
                  onClick={() => {
                    addToCart({
                      product: product._id,
                      name: product.name,
                      price: product.price,
                      quantity: 1,
                      image: product.image,
                    });

                    toast.success("Added to cart");
                  }}
                  className="
                    bg-amber-500
                    hover:bg-amber-600
                    text-white
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    transition
                  "
                >
                  Add to Cart
                </button>

                <button
                  aria-label="Buy now"
                  className="
                    border
                    border-gray-300
                    hover:bg-gray-50
                    text-gray-800
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    transition
                  "
                >
                  Buy Now
                </button>
              </div>

              {/* EXTRA */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Sold by{" "}
                  <span className="font-semibold text-gray-700">
                    Trusted Seller
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}