"use client";

import { useEffect, useMemo, useState } from "react";
import API from "@/lib/api";
import Link from "next/link";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  status?: "approved" | "pending" | "rejected";
  createdAt?: string;
}

type FilterType = "all" | "approved" | "pending" | "rejected";

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const fetchProducts = async () => {
    try {
      const res = await API.get("/seller/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const approvedCount = products.filter((p) => p.status === "approved").length;

  const pendingCount = products.filter((p) => p.status === "pending").length;

  const rejectedCount = products.filter((p) => p.status === "rejected").length;

  // 🔥 Filtered products
  const filteredProducts = useMemo(() => {
    switch (activeFilter) {
      case "approved":
        return products.filter((p) => p.status === "approved");

      case "pending":
        return products.filter((p) => p.status === "pending");

      case "rejected":
        return products.filter((p) => p.status === "rejected");

      default:
        return products;
    }
  }, [products, activeFilter]);

  // 🔥 Dynamic Heading
  const headingMap: Record<FilterType, string> = {
    all: "All Products",
    approved: "Approved Products",
    pending: "Pending Products",
    rejected: "Rejected Products",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Total */}
          <button
            onClick={() => setActiveFilter("all")}
            className={`text-left bg-white border rounded-2xl p-5 shadow-sm transition hover:shadow-md ${
              activeFilter === "all" ? "border-black ring-2 ring-black" : ""
            }`}
          >
            <p className="text-sm text-gray-500">Total Products</p>

            <h2 className="text-3xl font-bold mt-2">{products.length}</h2>
          </button>

          {/* Approved */}
          <button
            onClick={() => setActiveFilter("approved")}
            className={`text-left bg-white border rounded-2xl p-5 shadow-sm transition hover:shadow-md ${
              activeFilter === "approved"
                ? "border-green-500 ring-2 ring-green-500"
                : ""
            }`}
          >
            <p className="text-sm text-gray-500">Approved</p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {approvedCount}
            </h2>
          </button>

          {/* Pending */}
          <button
            onClick={() => setActiveFilter("pending")}
            className={`text-left bg-white border rounded-2xl p-5 shadow-sm transition hover:shadow-md ${
              activeFilter === "pending"
                ? "border-yellow-500 ring-2 ring-yellow-500"
                : ""
            }`}
          >
            <p className="text-sm text-gray-500">Pending</p>

            <h2 className="text-3xl font-bold text-yellow-500 mt-2">
              {pendingCount}
            </h2>
          </button>

          {/* Rejected */}
          <button
            onClick={() => setActiveFilter("rejected")}
            className={`text-left bg-white border rounded-2xl p-5 shadow-sm transition hover:shadow-md ${
              activeFilter === "rejected"
                ? "border-red-500 ring-2 ring-red-500"
                : ""
            }`}
          >
            <p className="text-sm text-gray-500">Rejected</p>

            <h2 className="text-3xl font-bold text-red-500 mt-2">
              {rejectedCount}
            </h2>
          </button>
        </div>

        {/* Dynamic Heading */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {headingMap[activeFilter]}
            </h1>

            <p className="text-gray-500 mt-1">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 && "s"} found
            </p>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="bg-white rounded-2xl border p-10 text-center">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border p-10 text-center">
            <h2 className="text-xl font-semibold">No products found</h2>

            <p className="text-gray-500 mt-2">
              No products available in this section
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="group bg-white border border-gray-200 rounded-3xl p-5 hover:shadow-xl hover:border-gray-300 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Image */}
                  <div className="relative w-full lg:w-52 h-52 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {p?.image?.trim() ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm backdrop-blur-md ${
                          p.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : p.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.status === "approved"
                          ? "Approved"
                          : p.status === "rejected"
                            ? "Rejected"
                            : "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col justify-between flex-1">
                    {/* Top */}
                    <div>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                            {p.name}
                          </h2>

                          <p className="text-3xl font-semibold text-blue-600 mt-2">
                            ₹{p.price}
                          </p>
                        </div>

                        <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-2xl border">
                          Added on{" "}
                          {p.createdAt
                            ? new Date(p.createdAt).toLocaleDateString("en-GB")
                            : "Recently added"}
                        </div>
                      </div>

                      {/* Optional Description */}
                      {p.description && (
                        <p className="mt-4 text-gray-600 leading-relaxed line-clamp-2">
                          {p.description}
                        </p>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex flex-wrap gap-3 mt-6">
                      <Link
                        href={`/seller/product/${p._id}`}
                        className="px-5 py-3 rounded-2xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
                      >
                        View Details
                      </Link>

                      <Link
                        href={`/seller/edit/${p._id}`}
                        className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow-sm"
                      >
                        Edit Product
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
