"use client";

import Link from "next/link";
import {
  Globe,
  Camera,
  Send,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Footer() {
  const [role, setRole] = useState<string>("");

  const getUserRole = () => {
    if (typeof window === "undefined") return "";

    try {
      const user = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      return user?.role || "";
    } catch {
      return "";
    }
  };

  useEffect(() => {
    const updateRole = () => setRole(getUserRole());

    updateRole();

    window.addEventListener("storage", updateRole);
    window.addEventListener("userChanged", updateRole);

    return () => {
      window.removeEventListener("storage", updateRole);
      window.removeEventListener("userChanged", updateRole);
    };
  }, []);

  const links: Record<
    string,
    { label: string; href: string }[]
  > = {
    guest: [
      { label: "Products", href: "/products" },
      { label: "Login", href: "/login" },
      { label: "Signup", href: "/signup" },
    ],

    user: [
      { label: "Cart", href: "/cart" },
      { label: "Orders", href: "/orders" },
      { label: "Products", href: "/products" },
    ],

    seller: [
      { label: "Dashboard", href: "/seller" },
      {
        label: "Add Product",
        href: "/seller/add-product",
      },
      { label: "Products", href: "/products" },
    ],

    admin: [
      { label: "Dashboard", href: "/admin" },
      { label: "Products", href: "/admin/products" },
      { label: "Orders", href: "/admin/orders" },
      { label: "Users", href: "/admin/users" },
      { label: "Revenue", href: "/admin/revenue" },
    ],
  };

  const currentLinks =
    role === "admin"
      ? links.admin
      : role === "seller"
      ? links.seller
      : role === "user"
      ? links.user
      : links.guest;

  return (
    <footer className="border-t border-amber-100 bg-[#faf7f2]">
      {/* TOP */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* BRAND */}
          <div>
            <Link href="/">
              <h2 className="text-3xl font-black tracking-tight text-gray-900">
                Shop<span className="text-amber-600">Ease</span>
              </h2>
            </Link>

            <p className="text-gray-600 mt-4 leading-relaxed text-sm">
              Premium shopping experience with curated
              collections, seamless delivery and modern
              lifestyle essentials.
            </p>

            {/* SOCIALS */}
            <div className="flex gap-3 mt-6">
              {[Globe, Camera, Send].map((Icon, i) => (
                <button
                  key={i}
                  className="
                    w-11
                    h-11
                    rounded-xl
                    bg-white
                    border
                    border-amber-100
                    flex
                    items-center
                    justify-center
                    text-gray-700
                    hover:bg-amber-500
                    hover:text-white
                    hover:border-amber-500
                    transition-all
                    duration-300
                  "
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-5">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">
              {currentLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    flex
                    items-center
                    gap-2
                    text-gray-600
                    hover:text-amber-600
                    transition-all
                    text-sm
                    font-medium
                    group
                  "
                >
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-5">
              Contact
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 rounded-xl bg-white border border-amber-100 flex items-center justify-center">
                  <Mail size={16} className="text-amber-600" />
                </div>

                support@shopease.com
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 rounded-xl bg-white border border-amber-100 flex items-center justify-center">
                  <Phone size={16} className="text-amber-600" />
                </div>

                +91 98740 66057
              </div>

              <div className="flex items-start gap-3 text-gray-600">
                <div className="w-10 h-10 rounded-xl bg-white border border-amber-100 flex items-center justify-center">
                  <MapPin
                    size={16}
                    className="text-amber-600"
                  />
                </div>

                Hyderabad, India
              </div>
            </div>
          </div>

          {/* CTA */}
          <div
            className="
              bg-white
              border
              border-amber-100
              rounded-3xl
              p-6
              shadow-sm
            "
          >
            <div
              className="
                w-14
                h-14
                rounded-2xl
                bg-amber-100
                flex
                items-center
                justify-center
                mb-5
              "
            >
              <Send className="text-amber-600" />
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Stay Updated
            </h3>

            <p className="text-gray-600 text-sm mt-3 leading-relaxed">
              Get exclusive deals, latest products and
              premium offers directly to your inbox.
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="
                  h-11
                  rounded-xl
                  border
                  border-gray-200
                  px-4
                  text-sm
                  outline-none
                  focus:border-amber-400
                  bg-[#fcfbf8]
                "
              />

              <button
                className="
                  h-11
                  rounded-xl
                  bg-amber-500
                  hover:bg-amber-600
                  text-white
                  font-semibold
                  transition-all
                  shadow-lg
                  shadow-amber-100
                "
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-amber-100">
        <div
          className="
            max-w-7xl
            mx-auto
            px-4
            py-5
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-3
          "
        >
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} ShopEase.
            All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link
              href="#"
              className="hover:text-amber-600 transition"
            >
              Privacy
            </Link>

            <Link
              href="#"
              className="hover:text-amber-600 transition"
            >
              Terms
            </Link>

            <Link
              href="#"
              className="hover:text-amber-600 transition"
            >
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}