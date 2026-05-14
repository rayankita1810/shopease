"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/lib/api";
import Link from "next/link";
import { addToCart } from "@/lib/cart";
import toast from "react-hot-toast";
import {
  SlidersHorizontal,
  ArrowUpDown,
  Grid3X3,
  LayoutList,
  Star,
} from "lucide-react";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  isTrending?: boolean;
}

function ProductsContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sort, setSort] = useState("latest");
  const [view, setView] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category");

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("");
    }

    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      let url = "/products";

      if (category) {
        url += `?category=${category}`;
      }

      const res = await API.get(url);

      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // SORTING
  const sortedProducts = useMemo(() => {
    const copied = [...products];

    switch (sort) {
      case "low":
        return copied.sort((a, b) => a.price - b.price);

      case "high":
        return copied.sort((a, b) => b.price - a.price);

      case "az":
        return copied.sort((a, b) => a.name.localeCompare(b.name));

      case "za":
        return copied.sort((a, b) => b.name.localeCompare(a.name));

      default:
        return copied;
    }
  }, [products, sort]);

  const categories = ["fashion", "mobile", "laptop", "home", "watch"];

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      {/* ================= HEADER ================= */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* TOP */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* TITLE */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {category ? `${category} Products` : "All Products"}
              </h1>

              <p className="text-gray-500 text-sm mt-1">
                {sortedProducts.length} products found
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* SORT */}
              <div className="relative">
                <ArrowUpDown
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="
                    h-10
                    pl-9
                    pr-4
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    text-sm
                    outline-none
                    focus:border-amber-500
                  "
                >
                  <option value="latest">Latest</option>
                  <option value="low">Price: Low to High</option>
                  <option value="high">Price: High to Low</option>
                  <option value="az">A - Z</option>
                  <option value="za">Z - A</option>
                </select>
              </div>

              {/* VIEW */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2.5 transition ${
                    view === "grid"
                      ? "bg-amber-500 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>

                <button
                  onClick={() => setView("list")}
                  className={`p-2.5 transition ${
                    view === "list"
                      ? "bg-amber-500 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  <LayoutList size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex gap-3 overflow-x-auto mt-5 pb-1">
            <button
              onClick={() => {
                setSelectedCategory("");
                router.push("/products");
              }}
              className={`
                whitespace-nowrap
                px-4
                py-2
                rounded-full
                text-sm
                font-medium
                transition
                ${
                  !selectedCategory
                    ? "bg-amber-500 text-white"
                    : "bg-white border border-gray-300 hover:border-amber-400"
                }
              `}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  router.push(`/products?category=${cat}`);
                }}
                className={`
                  whitespace-nowrap
                  px-4
                  py-2
                  rounded-full
                  capitalize
                  text-sm
                  font-medium
                  transition
                  ${
                    selectedCategory === cat
                      ? "bg-amber-500 text-white"
                      : "bg-white border border-gray-300 hover:border-amber-400"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border p-14 text-center">
            <SlidersHorizontal size={40} className="mx-auto text-gray-300" />

            <h2 className="text-2xl font-bold mt-5">No Products Found</h2>

            <p className="text-gray-500 mt-2">Try another category.</p>
          </div>
        ) : (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
                : "flex flex-col gap-4"
            }
          >
            {sortedProducts.map((product) => (
              <div
                key={product._id}
                className={`
                  bg-white
                  border
                  border-gray-200
                  rounded-xl
                  overflow-hidden
                  hover:shadow-md
                  transition-all
                  duration-300
                  group
                  flex flex-col
                  ${view === "list" ? "md:flex-row" : ""}
                `}
              >
                {/* IMAGE */}
                <Link
                  href={`/product/${product._id}`}
                  className={
                    view === "list"
                      ? "relative md:w-52 h-52 bg-[#f5f5f5] flex-shrink-0"
                      : "relative h-52 bg-[#f5f5f5]"
                  }
                >
                  {product?.image?.trim() ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes={
                        view === "list"
                          ? "(max-width: 768px) 100vw, 220px"
                          : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      }
                      className="
                        object-contain
                        p-4
                        transition-transform
                        duration-300
                        group-hover:scale-105
                      "
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}

                  {/* DEAL TAG */}
                  <div className="absolute top-2 left-2">
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                      DEAL
                    </span>
                  </div>
                </Link>

                {/* CONTENT */}
                <div className="p-4 flex flex-col flex-1 min-h-[240px]">
                  <p className="text-[11px] uppercase text-gray-400 font-medium tracking-wide">
                    {product.category}
                  </p>

                  <Link href={`/product/${product._id}`}>
                    <h2 className="text-[15px] font-semibold text-gray-800 leading-snug mt-1 hover:text-amber-600 transition line-clamp-2">
                      {product.name}
                    </h2>
                  </Link>

                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4].map((item) => (
                      <Star
                        key={item}
                        size={14}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}

                    <Star size={14} className="text-gray-300" />

                    <span className="text-xs text-blue-600 ml-1">1,245</span>
                  </div>

                  <p className="text-xs text-gray-500 mt-2 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  <p className="text-xs text-green-600 mt-2 font-medium">
                    In Stock ({product.stock})
                  </p>

                  <div className="mt-auto pt-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </span>

                      <span className="text-sm text-gray-400 line-through">
                        ₹{(product.price + 800).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-green-600 font-medium mt-1">
                      Save ₹800
                    </p>

                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/product/${product._id}`}
                        className="
                          hidden
                          sm:block
                          px-4
                          py-2.5
                          rounded-lg
                          border
                          border-gray-300
                          text-sm
                          font-medium
                          hover:bg-gray-50
                          transition
                          whitespace-nowrap
                        "
                      >
                        View Product
                      </Link>

                      <button
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
                          text-sm
                          font-semibold
                          px-5
                          py-2.5
                          rounded-lg
                          transition
                          whitespace-nowrap
                        "
                      >
                        Add
                      </button>
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading products...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}