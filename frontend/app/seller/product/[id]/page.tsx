"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
  updatedAt: string;
}

export default function SellerProductViewPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p className="text-red-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Top Actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          ← Back
        </button>

        <Link
          href={`/seller/edit/${product._id}`}
          className="bg-black text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
        >
          Edit Product
        </Link>
      </div>

      {/* Main Card */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Product Image */}
          <div className="relative w-full h-[350px] md:h-[500px] rounded-2xl overflow-hidden border bg-gray-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Status */}
            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {product.status === "approved"
                  ? "Approved"
                  : "Pending Admin Approval"}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-3xl font-bold text-black mb-6">
              ₹{product.price}
            </p>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>

              <p className="text-gray-600 leading-7">{product.description}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">Category</p>

                <p className="font-semibold text-gray-900">
                  {product.category}
                </p>
              </div>

              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">Stock</p>

                <p className="font-semibold text-gray-900">{product.stock}</p>
                {product.stock <= 5 && (
                  <span className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full">
                    Low Stock
                  </span>
                )}
              </div>

              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">Created</p>

                <p className="font-semibold text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString("en-GB")}
                </p>
              </div>

              <div className="border rounded-xl p-4 bg-gray-50">
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>

                <p className="font-semibold text-gray-900">
                  {new Date(product.updatedAt).toLocaleDateString("en-GB")}
                </p>
              </div>
            </div>

            {/* Product ID */}
            <div className="border rounded-xl p-4 bg-gray-50">
              <p className="text-sm text-gray-500 mb-1">Product ID</p>

              <p className="font-mono text-sm break-all text-gray-800">
                {product._id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
