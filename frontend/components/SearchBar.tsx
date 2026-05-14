"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Search,
  Loader2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // ✨ Typing Placeholder Animation
  const placeholders = [
    "Search iPhone...",
    "Search sneakers...",
    "Search laptops...",
    "Search watches...",
    "Search fashion...",
  ];

  const [placeholder, setPlaceholder] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentText = placeholders[placeholderIndex];

    const timeout = setTimeout(() => {
      if (charIndex < currentText.length) {
        setPlaceholder(
          currentText.substring(0, charIndex + 1)
        );
        setCharIndex((prev) => prev + 1);
      } else {
        setTimeout(() => {
          setCharIndex(0);

          setPlaceholderIndex(
            (prev) => (prev + 1) % placeholders.length
          );

          setPlaceholder("");
        }, 1500);
      }
    }, 80);

    return () => clearTimeout(timeout);
  }, [charIndex, placeholderIndex]);

  const handleSearch = async (value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const res = await API.get(
        `/products/search?q=${value}`
      );

      setResults(res.data);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      setResults([]);
      router.push(`/search?q=${query}`);
    }
  };

  return (
    <div className="relative w-full max-w-xl">
      
      {/* SEARCH BOX */}
      <div className="relative group">

        {/* LEFT ICON */}
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        {/* INPUT */}
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder + "|"}
          className="
            w-full
            h-14
            pl-12
            pr-14
            rounded-2xl
            border
            border-gray-200
            bg-white/90
            backdrop-blur
            shadow-sm
            focus:outline-none
            focus:ring-2
            focus:ring-amber-500
            focus:border-amber-500
            transition-all
            text-sm
            placeholder:text-gray-400
          "
        />

        {/* RIGHT ICON */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2
              size={18}
              className="animate-spin text-amber-500"
            />
          ) : (
            <Sparkles
              size={18}
              className="text-amber-500"
            />
          )}
        </div>

      </div>

      {/* DROPDOWN */}
      {(results.length > 0 || loading) && (
        <div
          className="
            absolute
            top-16
            w-full
            bg-white
            border
            border-gray-100
            rounded-2xl
            shadow-2xl
            overflow-hidden
            z-50
          "
        >

          {/* LOADING */}
          {loading && (
            <div className="p-6 text-center text-gray-500">
              <Loader2 className="animate-spin mx-auto mb-2" />
              Searching products...
            </div>
          )}

          {/* RESULTS */}
          {!loading && (
            <>
              {results.map((item) => (
                <div
                  key={item._id}
                  onClick={() => {
                    setResults([]);
                    router.push(`/product/${item._id}`);
                  }}
                  className="
                    group
                    flex
                    items-center
                    gap-4
                    p-4
                    cursor-pointer
                    hover:bg-gray-50
                    transition
                    border-b
                    border-gray-100
                    last:border-none
                  "
                >

                  {/* IMAGE */}
                  <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-800 truncate">
                      {item.name}
                    </h3>

                    <p className="text-amber-600 font-bold mt-1">
                      ₹{item.price}
                    </p>

                    {item.category && (
                      <p className="text-xs text-gray-400 mt-1 capitalize">
                        {item.category}
                      </p>
                    )}
                  </div>

                  {/* ARROW */}
                  <ArrowRight
                    size={18}
                    className="
                      text-gray-300
                      group-hover:text-amber-500
                      group-hover:translate-x-1
                      transition
                    "
                  />

                </div>
              ))}

              {/* VIEW ALL */}
              <button
                onClick={() => {
                  setResults([]);
                  router.push(`/search?q=${query}`);
                }}
                className="
                  w-full
                  p-4
                  bg-gray-50
                  hover:bg-amber-50
                  text-sm
                  font-semibold
                  text-amber-600
                  transition
                "
              >
                View all results for "{query}"
              </button>
            </>
          )}

        </div>
      )}
    </div>
  );
}