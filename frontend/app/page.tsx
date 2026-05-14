"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Shirt,
  HomeIcon,
  Watch,
  ArrowRight,
  ShoppingBag,
  Zap,
  Star,
} from "lucide-react";
import API from "@/lib/api";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  // ADD THIS STATE
  const heroImages = [
    "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop",
    "https://vasanthandco.in/UploadedFiles/productimages/20251217041328-Untitled-51.png",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // ADD THIS useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === heroImages.length - 1 ? 0 : prev + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await API.get("/products/trending");
        // console.log(res);

        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchTrending();
  }, []);

  const categories = [
    {
      name: "Fashion",
      icon: Shirt,
      slug: "fashion",
    },
    {
      name: "Mobile",
      icon: Smartphone,
      slug: "mobile",
    },
    {
      name: "Watch",
      icon: Watch,
      slug: "watch",
    },
    {
      name: "Laptops",
      icon: Laptop,
      slug: "laptop",
    },
    {
      name: "Home",
      icon: HomeIcon,
      slug: "home",
    },
  ];

  return (
    <div className="bg-[#f6f7f9] min-h-screen">
      {/* ================= HERO ================= */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-amber-50 to-[#f6f7f9]">
        <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* LEFT */}
            <div>
              <div
                className="
                inline-flex
                items-center
                gap-2
                bg-white
                border
                border-amber-200
                px-4
                py-2
                rounded-full
                text-sm
                font-medium
                text-amber-700
              "
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Premium Collection 2026
              </div>

              <h1
                className="
                mt-5
                text-4xl
                md:text-5xl
                lg:text-6xl
                font-black
                leading-tight
                tracking-tight
                text-gray-900
              "
              >
                Shop Smarter.
                <br />
                Live Better.
              </h1>

              <p
                className="
                mt-5
                text-gray-600
                text-lg
                leading-relaxed
                max-w-xl
              "
              >
                Discover premium fashion, gadgets, lifestyle products and
                curated essentials with modern design.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/products"
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
                  Shop Now
                </Link>

                <Link
                  href="/products"
                  className="
                    bg-white
                    border
                    border-gray-300
                    hover:border-amber-400
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    transition
                  "
                >
                  Explore Products
                </Link>
              </div>

              {/* STATS */}
              <div className="mt-10 flex gap-8 flex-wrap">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">12K+</h3>

                  <p className="text-sm text-gray-500">Customers</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900">150+</h3>

                  <p className="text-sm text-gray-500">Brands</p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900">4.9★</h3>

                  <p className="text-sm text-gray-500">Ratings</p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            {/* RIGHT */}
            <div className="hidden lg:flex justify-center">
              <div
                className="
      w-full
      max-w-md
      bg-white
      border
      border-gray-200
      rounded-3xl
      p-5
      shadow-sm
    "
              >
                {/* SLIDER */}
                <div className="relative h-[350px] rounded-2xl overflow-hidden">
                  {heroImages.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt="Hero Banner"
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={`
    absolute
    inset-0
    object-cover
    transition-all
    duration-700
    ${currentSlide === index ? "opacity-100 scale-100" : "opacity-0 scale-105"}
  `}
                    />
                  ))}

                  {/* OVERLAY */}
                  <div
                    className="
          absolute
          inset-0
          bg-gradient-to-t
          from-black/40
          via-black/10
          to-transparent
        "
                  />

                  {/* BADGE */}
                  <div className="absolute top-4 left-4">
                    <span
                      className="
            bg-white/90
            backdrop-blur
            text-amber-700
            px-3
            py-1.5
            rounded-full
            text-xs
            font-bold
          "
                    >
                      Trending Collection
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-white/80 text-sm">Premium Deals</p>

                        <h3 className="text-2xl font-bold text-white mt-1">
                          Luxury Essentials
                        </h3>
                      </div>

                      <div
                        className="
              bg-amber-500
              text-white
              px-4
              py-2
              rounded-xl
              text-sm
              font-bold
              shadow-lg
            "
                      >
                        50% OFF
                      </div>
                    </div>
                  </div>
                </div>

                {/* DOTS */}
                <div className="flex items-center justify-center gap-2 mt-5">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`
            h-2 rounded-full transition-all
            ${currentSlide === index ? "w-8 bg-amber-500" : "w-2 bg-gray-300"}
          `}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Shop Categories
            </h2>

            <p className="text-gray-500 mt-1">Explore products by category</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="
                bg-white
                border
                border-gray-200
                rounded-2xl
                p-5
                hover:border-amber-300
                hover:shadow-sm
                transition-all
                group
              "
            >
              <div
                className="
                w-12
                h-12
                rounded-xl
                bg-amber-50
                flex
                items-center
                justify-center
                text-amber-600
              "
              >
                <cat.icon className="w-6 h-6" />
              </div>

              <div className="mt-5">
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>

                <p
                  className="
                  text-sm
                  text-gray-400
                  mt-1
                  group-hover:text-amber-600
                  transition
                "
                >
                  Explore →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= TRENDING ================= */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        {/* TITLE */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Trending Products
            </h2>

            <p className="text-gray-500 mt-1">
              Most popular products right now
            </p>
          </div>

          <Link
            href="/products"
            className="
              hidden sm:flex
              items-center
              gap-2
              text-amber-700
              font-semibold
              hover:gap-3
              transition-all
            "
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div
            className="
            bg-white
            border
            border-dashed
            border-gray-300
            rounded-2xl
            h-56
            flex
            flex-col
            items-center
            justify-center
          "
          >
            <Zap className="w-8 h-8 text-amber-400 animate-pulse mb-3" />

            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : (
          <div
            className="
            grid
            grid-cols-2
            md:grid-cols-3
            lg:grid-cols-5
            gap-4
          "
          >
            {products.map((p) => (
              <div
                key={p._id}
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-xl
                  overflow-hidden
                  hover:shadow-md
                  transition-all
                  duration-300
                  group
                  flex
                  flex-col
                "
              >
                {/* IMAGE */}
                <Link
                  href={`/product/${p._id}`}
                  className="
                    relative
                    h-52
                    bg-[#f5f5f5]
                    overflow-hidden
                  "
                >
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="
    object-contain
    p-4
    group-hover:scale-105
    transition
    duration-300
  "
                  />

                  <div className="absolute top-2 left-2">
                    <span
                      className="
                      bg-red-500
                      text-white
                      text-[10px]
                      font-bold
                      px-2
                      py-1
                      rounded
                    "
                    >
                      TRENDING
                    </span>
                  </div>
                </Link>

                {/* CONTENT */}
                <div className="p-4 flex flex-col flex-1">
                  <p
                    className="
                    text-[11px]
                    uppercase
                    text-gray-400
                    font-medium
                    tracking-wide
                  "
                  >
                    {p.category || "Premium"}
                  </p>

                  <Link href={`/product/${p._id}`}>
                    <h3
                      className="
                      text-sm
                      font-semibold
                      text-gray-800
                      leading-snug
                      mt-1
                      hover:text-amber-600
                      transition
                      line-clamp-2
                    "
                    >
                      {p.name}
                    </h3>
                  </Link>

                  {/* RATING */}
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4].map((item) => (
                      <Star
                        key={item}
                        size={13}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}

                    <Star size={13} className="text-gray-300" />

                    <span className="text-xs text-gray-400 ml-1">4.2</span>
                  </div>

                  {/* PRICE */}
                  <div className="mt-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{p.price.toLocaleString()}
                      </span>

                      <span className="text-sm text-gray-400 line-through">
                        ₹{(p.price + 800).toLocaleString()}
                      </span>
                    </div>

                    <p className="text-xs text-green-600 font-medium mt-1">
                      Save ₹800
                    </p>
                  </div>

                  {/* BUTTON */}
                  <Link
                    href={`/product/${p._id}`}
                    className="
                      mt-4
                      bg-amber-500
                      hover:bg-amber-600
                      text-white
                      text-sm
                      font-semibold
                      py-2.5
                      rounded-lg
                      text-center
                      transition
                    "
                  >
                    View Product
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ================= CTA ================= */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div
          className="
          bg-gradient-to-r
          from-amber-50
          to-orange-50
          border
          border-amber-100
          rounded-3xl
          p-8
          md:p-12
          text-center
        "
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Join Our Premium Club
          </h2>

          <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
            Get exclusive offers, premium deals and early access to trending
            products.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="
                flex-1
                bg-white
                border
                border-gray-300
                rounded-xl
                px-5
                py-3.5
                outline-none
                focus:border-amber-400
              "
            />

            <button
              className="
              bg-amber-500
              hover:bg-amber-600
              text-white
              px-7
              py-3.5
              rounded-xl
              font-semibold
              transition
            "
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
