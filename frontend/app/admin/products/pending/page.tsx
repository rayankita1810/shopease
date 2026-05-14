"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Image from "next/image";
import { toast } from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  category: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchPending = async () => {
    try {
      const res = await API.get("/products/pending");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load pending products");
    }
  };

  const approve = async (id: string) => {
    try {
      setLoadingId(id);

      await API.put(`/products/approve/${id}`);

      toast.success("Product approved successfully");

      fetchPending();
    } catch (err) {
      console.error(err);
      toast.error("Approve failed");
    } finally {
      setLoadingId(null);
    }
  };

  const reject = async (id: string) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this product?",
    );

    if (!confirmReject) return;

    try {
      setLoadingId(id);

      await API.delete(`/products/reject/${id}`);

      toast.success("Product rejected successfully");

      fetchPending();
    } catch (err) {
      console.error(err);
      toast.error("Reject failed");
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Pending Products</h1>

          <p className="text-gray-500 mt-1">
            Review and approve seller products
          </p>
        </div>

        <div className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium">
          Total: {products.length}
        </div>
      </div>

      {/* Empty */}
      {products.length === 0 ? (
        <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">
          <p className="text-gray-500 text-lg">
            No pending products 🚫
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl border shadow-sm hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover hover:scale-105 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Category */}
                <span className="inline-block text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full mb-3">
                  {product.category}
                </span>

                {/* Name */}
                <h2 className="text-lg font-semibold line-clamp-1">
                  {product.name}
                </h2>

                {/* Price */}
                <p className="text-2xl font-bold text-green-600 mt-2">
                  ₹{product.price}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                  {product.description}
                </p>

                {/* Stock */}
                <div className="mt-4">
                  {product.stock > 0 ? (
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      In Stock: {product.stock}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-red-500 bg-red-50 px-3 py-1 rounded-full">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => approve(product._id)}
                    disabled={loadingId === product._id}
                    className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white py-2.5 rounded-xl transition font-medium"
                  >
                    {loadingId === product._id
                      ? "Processing..."
                      : "Approve"}
                  </button>

                  <button
                    onClick={() => reject(product._id)}
                    disabled={loadingId === product._id}
                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-2.5 rounded-xl transition font-medium"
                  >
                    {loadingId === product._id
                      ? "Processing..."
                      : "Reject"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}