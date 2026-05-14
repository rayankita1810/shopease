"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import API from "@/lib/api";
import Image from "next/image";
import { addToCart } from "@/lib/cart";
import { toast } from "react-hot-toast";

export default function SearchContent() {
  const params = useSearchParams();
  const query = params.get("q");

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        setLoading(true);

        const res = await API.get(
          `/products/search?q=${encodeURIComponent(query)}`
        );

        setProducts(res.data);
      } catch (error) {
        console.error(error);

        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <p className="text-gray-300 text-sm font-medium">
            Search Results
          </p>

          <h1 className="text-4xl font-bold mt-2 break-words">
            "{query}"
          </h1>

          <p className="text-gray-400 mt-3">
            {products.length} products found
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="h-14 w-14 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto"></div>

              <p className="mt-4 text-gray-500">
                Loading products...
              </p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-3xl p-14 text-center border">
            <h2 className="text-2xl font-bold text-gray-800">
              No Products Found
            </h2>

            <p className="text-gray-500 mt-3">
              Try searching for another product keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((item) => (
              <div
                key={item._id}
                className="
                  bg-white
                  rounded-3xl
                  overflow-hidden
                  border
                  shadow-sm
                  hover:shadow-2xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  group
                "
              >
                {/* IMAGE */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="
                      object-cover
                      group-hover:scale-105
                      transition-transform
                      duration-500
                    "
                  />
                </div>

                {/* CONTENT */}
                <div className="p-5">
                  <h2 className="font-semibold text-lg line-clamp-1 text-gray-900">
                    {item.name}
                  </h2>

                  <p className="text-2xl font-bold mt-3 text-black">
                    ₹{item.price}
                  </p>

                  {/* BUTTON */}
                  <button
                    onClick={() => {
                      addToCart({
                        product: item._id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                        image: item.image,
                      });

                      toast.success("Added to cart ✅");
                    }}
                    className="
                      mt-5
                      w-full
                      bg-black
                      text-white
                      py-3
                      rounded-2xl
                      font-semibold
                      hover:bg-gray-800
                      transition
                    "
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}