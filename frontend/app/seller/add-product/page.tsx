"use client";

import { useState } from "react";
import API from "@/lib/api";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import toast from "react-hot-toast";

export default function AddProduct() {
  useAuth(["seller", "admin"]);
  const router = useRouter();

  // ========================
  // MODE: single | bulk
  // ========================
  const [mode, setMode] = useState<"single" | "bulk">("single");

  // ========================
  // SINGLE PRODUCT STATE
  // ========================
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [file, setFile] = useState<File | null>(null);

  // ========================
  // CSV STATE
  // ========================
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // ========================
  // COMMON STATE
  // ========================
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ========================
  // SUBMIT HANDLER
  // ========================
  const handleSubmit = async () => {
    try {
      setLoading(true);

      // ========================
      // 📦 BULK CSV UPLOAD
      // ========================
      if (mode === "bulk") {
        if (!csvFile) {
          toast.error("Please upload a CSV file");
          return;
        }

        const formData = new FormData();
        formData.append("file", csvFile);

        await API.post("/products/bulk", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Bulk products uploaded successfully!");
        router.push("/seller");
        return;
      }

      // ========================
      // 🟢 SINGLE PRODUCT UPLOAD
      // ========================
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) =>
        formData.append(key, value)
      );

      if (file) {
        formData.append("image", file);
      }

      await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product added successfully!");
      router.push("/seller");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">

      {/* ========================
          HEADER
      ======================== */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Add New Product
        </h1>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : mode === "bulk"
            ? "Upload CSV"
            : "Add Product"}
        </button>
      </div>

      {/* ========================
          MODE SWITCH
      ======================== */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setMode("single")}
          className={`px-4 py-2 rounded-lg border ${
            mode === "single"
              ? "bg-green-600 text-white"
              : "bg-white"
          }`}
        >
          Single Product
        </button>

        <button
          onClick={() => setMode("bulk")}
          className={`px-4 py-2 rounded-lg border ${
            mode === "bulk"
              ? "bg-green-600 text-white"
              : "bg-white"
          }`}
        >
          CSV Bulk Upload
        </button>
      </div>

      {/* ========================
          SINGLE PRODUCT UI
      ======================== */}
      {mode === "single" && (
        <div className="bg-white border rounded-2xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6">

            {/* IMAGE UPLOAD */}
            <div className="space-y-4">
              <div className="relative w-full h-[350px] md:h-[450px] rounded-2xl overflow-hidden border bg-gray-100 flex items-center justify-center">
                {file ? (
                  <Image
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <p className="text-gray-400 text-sm">
                    Image preview
                  </p>
                )}
              </div>

              <input
                type="file"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                className="w-full border rounded-xl px-4 py-3 cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-100 file:rounded-lg file:text-sm"
              />
            </div>

            {/* FORM FIELDS */}
            <div className="flex flex-col gap-5">

              <div>
                <label className="text-sm text-gray-500">
                  Product Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Price
                </label>
                <input
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full mt-1 border rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="text-sm text-gray-500">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full mt-1 border rounded-xl px-4 py-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">

                <input
                  name="category"
                  placeholder="Category"
                  value={form.category}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3"
                />

                <input
                  name="stock"
                  type="number"
                  placeholder="Stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="border rounded-xl px-4 py-3"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================
          CSV BULK UPLOAD UI
      ======================== */}
      {mode === "bulk" && (
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Upload CSV File
          </h2>

          <input
            type="file"
            accept=".csv"
            onChange={(e) =>
              setCsvFile(e.target.files?.[0] || null)
            }
            className="w-full border rounded-xl px-4 py-3 cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-100 file:rounded-lg file:text-sm"
          />

          <p className="text-sm text-gray-500 mt-3">
            CSV format: name, description, price, category, stock, imageUrl
          </p>

          <div className="mt-4 text-sm text-blue-600">
            Tip: Download sample CSV before uploading
          </div>
        </div>
      )}
    </div>
  );
}