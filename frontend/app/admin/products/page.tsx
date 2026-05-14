"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  isTrending: boolean;
  status: "pending" | "approved" | "rejected";
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      const res = await API.get("/admin/products");

      setProducts(res.data);
    } catch (err) {
      // console.log(err);

      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // TOGGLE TRENDING
  // =========================

  const toggleTrending = async (id: string) => {
    try {
      await API.patch(`/products/${id}/trending`);

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                ...p,
                isTrending: !p.isTrending,
              }
            : p,
        ),
      );

      toast.success("Trending updated");
    } catch (err: any) {
      // console.log(err);

      toast.error(err?.response?.data?.message || "Trending update failed");
    }
  };

  // =========================
  // CHANGE STATUS
  // =========================

  const changeStatus = async (
    id: string,
    status: "approved" | "pending" | "rejected",
  ) => {
    const confirmAction = window.confirm(
      `Are you sure you want to mark this product as ${status}?`,
    );

    if (!confirmAction) return;

    try {
      await API.patch(`/admin/products/${id}/status`, {
        status,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id
            ? {
                ...p,
                status,
              }
            : p,
        ),
      );

      toast.success("Status updated");
    } catch (err) {
      // console.log(err);

      toast.error("Failed to update status");
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading products...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Product Management</h1>

            <p className="text-gray-500 mt-1">
              Approve, reject and manage products
            </p>
          </div>

          <Link
            href="/admin/products/pending"
            className="bg-black text-white px-5 py-3 rounded-xl hover:bg-gray-800 transition w-fit"
          >
            View Pending Products
          </Link>
        </div>

        {/* EMPTY */}
        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-500 shadow">
            No products found
          </div>
        ) : (
          /* GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow hover:shadow-xl transition duration-300"
              >
                {/* IMAGE */}
                <div className="relative h-56">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />

                  {/* BADGES */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    {product.isTrending && (
                      <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
                        Trending
                      </span>
                    )}

                    {product.stock === 0 && (
                      <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full shadow">
                        Out of Stock
                      </span>
                    )}

                    {product.status === "approved" && (
                      <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow">
                        Approved
                      </span>
                    )}

                    {product.status === "pending" && (
                      <span className="bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow">
                        Pending
                      </span>
                    )}

                    {product.status === "rejected" && (
                      <span className="bg-red-700 text-white text-xs px-3 py-1 rounded-full shadow">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <p className="text-sm text-blue-600 font-medium">
                    {product.category}
                  </p>

                  <h2 className="font-semibold text-lg mt-1 line-clamp-1">
                    {product.name}
                  </h2>

                  <p className="text-2xl font-bold mt-2">₹{product.price}</p>

                  <p className="text-sm text-gray-500 mt-1">
                    Stock: {product.stock}
                  </p>

                  {/* TRENDING BUTTON */}
                  <button
                    onClick={() => toggleTrending(product._id)}
                    className={`w-full mt-4 py-2 rounded-xl text-white font-medium transition ${
                      product.isTrending
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {product.isTrending ? "Remove Trending" : "Make Trending"}
                  </button>

                  {/* STATUS ACTIONS */}
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {/* APPROVE */}
                    <button
                      onClick={() => changeStatus(product._id, "approved")}
                      className={`py-2 rounded-lg text-sm font-medium transition ${
                        product.status === "approved"
                          ? "bg-green-600 text-white"
                          : "bg-gray-200 hover:bg-green-100"
                      }`}
                    >
                      Approve
                    </button>

                    {/* PENDING */}
                    <button
                      onClick={() => changeStatus(product._id, "pending")}
                      className={`py-2 rounded-lg text-sm font-medium transition ${
                        product.status === "pending"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-200 hover:bg-yellow-100"
                      }`}
                    >
                      Pending
                    </button>

                    {/* REJECT */}
                    <button
                      onClick={() => changeStatus(product._id, "rejected")}
                      className={`py-2 rounded-lg text-sm font-medium transition ${
                        product.status === "rejected"
                          ? "bg-red-600 text-white"
                          : "bg-gray-200 hover:bg-red-100"
                      }`}
                    >
                      Reject
                    </button>
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
