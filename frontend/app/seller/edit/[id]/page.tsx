"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setForm(res.data);
      } catch (err) {
        console.error(err);
        toast.error("ailed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await API.put(`/seller/product/${id}`, form);
      toast.success("Product updated! Waiting for admin approval");
      router.push("/seller");
    } catch (err) {
      console.error(err);
      toast.error("Update failed. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto text-gray-500">
        Loading product...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="border px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          ← Back
        </button>

        <button
          onClick={handleUpdate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition"
        >
          Save Changes
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Image Preview */}
          <div className="space-y-4">
            <div className="relative w-full h-[350px] md:h-[500px] rounded-2xl overflow-hidden border bg-gray-100">
              {form.image && (
                <Image
                  src={form.image}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <input
              type="text"
              placeholder="Image URL"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Editable Details */}
          <div className="flex flex-col gap-5">
            {/* Name */}
            <div>
              <label className="text-sm text-gray-500">Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full mt-1 border rounded-xl px-4 py-3 text-lg font-semibold focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price */}
            <div>
              <label className="text-sm text-gray-500">Price</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full mt-1 border rounded-xl px-4 py-3 text-lg font-semibold focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-gray-500">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full mt-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Grid fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-500">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full mt-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full mt-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
