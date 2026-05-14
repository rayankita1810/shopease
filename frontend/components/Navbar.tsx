"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Menu,
  X,
  LogOut,
  ShoppingBag,
  LayoutDashboard,
  Store,
  ChevronDown,
  User,
} from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const pathname = usePathname();

  const profileRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // ================= CART =================
  const updateCartCount = () => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    const key = user ? `cart_${user._id}` : "cart_guest";

    const cart = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    const total = cart.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    );

    setCartCount(total);
  };

  useEffect(() => {
    updateCartCount();

    window.addEventListener(
      "cartUpdated",
      updateCartCount
    );

    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener(
        "cartUpdated",
        updateCartCount
      );

      window.removeEventListener(
        "storage",
        updateCartCount
      );
    };
  }, []);

  // ================= USER =================
  useEffect(() => {
    const updateUser = () => {
      const stored = localStorage.getItem("user");

      setUser(stored ? JSON.parse(stored) : null);
    };

    updateUser();

    window.addEventListener("storage", updateUser);
    window.addEventListener("userChanged", updateUser);

    return () => {
      window.removeEventListener(
        "storage",
        updateUser
      );

      window.removeEventListener(
        "userChanged",
        updateUser
      );
    };
  }, []);

  // ================= OUTSIDE CLICK =================
  useEffect(() => {
    const handleClick = (e: any) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setOpen(false);
      }

      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("userChanged"));

    window.location.href = "/login";
  };

  const role = user?.role;

  // ================= MENU ITEMS =================
  const dropdownItems = [
    {
      href: "/products",
      label: "Shop",
    },

    {
      href: "/orders",
      label: "My Orders",
    },

    {
      href: "/track-order",
      label: "Track Order",
    },

    ...(role === "seller"
      ? [
          {
            href: "/seller",
            label: "Seller Dashboard",
          },

          {
            href: "/seller/add-product",
            label: "Add Product",
          },

          {
            href: "/seller/orders",
            label: "Seller Orders",
          },
        ]
      : []),

    ...(role === "admin"
      ? [
          {
            href: "/admin",
            label: "Admin Dashboard",
          },

          {
            href: "/admin/products",
            label: "Products",
          },

          {
            href: "/admin/orders",
            label: "Orders",
          },

          {
            href: "/admin/users",
            label: "Users",
          },

          {
            href: "/admin/revenue",
            label: "Revenue",
          },
        ]
      : []),
  ];

  return (
    <nav
      className="
        sticky
        top-0
        z-50
        bg-white/80
        backdrop-blur-xl
        border-b
        border-amber-100
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          h-16
          flex
          items-center
          justify-between
          gap-4
        "
      >
        {/* ================= LOGO ================= */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
        >
          <Image
            src="/logo-new.png"
            alt="ShopEase"
            width={42}
            height={42}
            priority
            className="object-contain"
          />

          <div className="leading-none">
            <h2 className="text-xl font-black tracking-tight text-gray-900">
              Shop
              <span className="text-amber-600">
                Ease
              </span>
            </h2>

            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.18em]
                text-gray-400
              "
            >
              Multi Vendor
            </p>
          </div>
        </Link>

        {/* ================= SEARCH ================= */}
        {(pathname === "/" ||
          pathname === "/products") && (
          <div className="hidden md:block flex-1 max-w-xl">
            <SearchBar />
          </div>
        )}

        {/* ================= DESKTOP ================= */}
        <div className="hidden md:flex items-center gap-2">
          {/* SHOP */}
          <Link
            href="/products"
            className="
              px-4
              py-2
              text-sm
              font-medium
              text-gray-700
              hover:text-amber-600
              transition
            "
          >
            Shop
          </Link>

          {/* CART */}
          <Link
            href="/cart"
            className="
              relative
              w-11
              h-11
              rounded-xl
              border
              border-gray-200
              bg-white
              flex
              items-center
              justify-center
              hover:border-amber-300
              hover:bg-amber-50
              transition-all
            "
          >
            <ShoppingCart
              size={20}
              className="text-gray-700"
            />

            {cartCount > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  min-w-[18px]
                  h-[18px]
                  px-1
                  rounded-full
                  bg-amber-500
                  text-white
                  text-[10px]
                  font-bold
                  flex
                  items-center
                  justify-center
                "
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* GUEST */}
          {!user && (
            <>
              <Link
                href="/login"
                className="
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-gray-700
                  hover:text-amber-600
                "
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="
                  h-11
                  px-5
                  rounded-xl
                  bg-amber-500
                  hover:bg-amber-600
                  text-white
                  text-sm
                  font-semibold
                  flex
                  items-center
                  justify-center
                  transition
                "
              >
                Sign Up
              </Link>
            </>
          )}

          {/* USER MENU */}
          {user && (
            <>
              {/* MENU */}
              <div
                ref={menuRef}
                className="relative"
              >
                <button
                  onClick={() =>
                    setMenuOpen(!menuOpen)
                  }
                  className="
                    h-11
                    px-4
                    rounded-xl
                    border
                    border-gray-200
                    bg-white
                    hover:border-amber-300
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    transition
                  "
                >
                  <Store size={18} />

                  Menu

                  <ChevronDown size={16} />
                </button>

                {menuOpen && (
                  <div
                    className="
                      absolute
                      right-0
                      mt-3
                      w-60
                      bg-white
                      border
                      border-gray-200
                      rounded-2xl
                      shadow-xl
                      p-2
                    "
                  >
                    {dropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="
                          flex
                          items-center
                          px-3
                          py-2.5
                          rounded-xl
                          text-sm
                          font-medium
                          text-gray-700
                          hover:bg-amber-50
                          hover:text-amber-700
                          transition
                        "
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* PROFILE */}
              <div
                ref={profileRef}
                className="relative"
              >
                <button
                  onClick={() => setOpen(!open)}
                  className="
                    flex
                    items-center
                    gap-2
                    pl-2
                    pr-3
                    h-11
                    rounded-xl
                    border
                    border-gray-200
                    hover:border-amber-300
                    bg-white
                    transition
                  "
                >
                  <div
                    className="
                      w-8
                      h-8
                      rounded-full
                      bg-amber-100
                      text-amber-700
                      flex
                      items-center
                      justify-center
                      font-bold
                      text-sm
                    "
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>

                  <span className="text-sm font-medium text-gray-700 max-w-[90px] truncate">
                    {user.name}
                  </span>
                </button>

                {open && (
                  <div
                    className="
                      absolute
                      right-0
                      mt-3
                      w-56
                      bg-white
                      border
                      border-gray-200
                      rounded-2xl
                      shadow-xl
                      overflow-hidden
                    "
                  >
                    <div className="p-4 border-b">
                      <p className="text-xs text-gray-500">
                        Signed in as
                      </p>

                      <p className="text-sm font-semibold text-gray-900 truncate mt-1">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="
                        w-full
                        flex
                        items-center
                        gap-2
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-red-500
                        hover:bg-red-50
                        transition
                      "
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ================= MOBILE BUTTON ================= */}
        <button
          onClick={() =>
            setMobileOpen(!mobileOpen)
          }
          className="
            md:hidden
            w-11
            h-11
            rounded-xl
            border
            border-gray-200
            flex
            items-center
            justify-center
          "
        >
          {mobileOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="md:hidden border-t border-amber-100 bg-white">
          <div className="px-4 py-4 space-y-2">
            <SearchBar />

            <Link
              href="/products"
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                hover:bg-amber-50
              "
            >
              <ShoppingBag size={18} />
              Shop
            </Link>

            <Link
              href="/cart"
              className="
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-xl
                hover:bg-amber-50
              "
            >
              <ShoppingCart size={18} />
              Cart ({cartCount})
            </Link>

            {dropdownItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() =>
                  setMobileOpen(false)
                }
                className="
                  block
                  px-4
                  py-3
                  rounded-xl
                  hover:bg-amber-50
                  text-sm
                  font-medium
                  text-gray-700
                "
              >
                {item.label}
              </Link>
            ))}

            {!user ? (
              <div className="flex gap-3 pt-2">
                <Link
                  href="/login"
                  className="
                    flex-1
                    h-11
                    rounded-xl
                    border
                    border-gray-200
                    flex
                    items-center
                    justify-center
                    text-sm
                    font-medium
                  "
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  className="
                    flex-1
                    h-11
                    rounded-xl
                    bg-amber-500
                    text-white
                    flex
                    items-center
                    justify-center
                    text-sm
                    font-semibold
                  "
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                className="
                  w-full
                  mt-2
                  h-11
                  rounded-xl
                  bg-red-50
                  text-red-500
                  text-sm
                  font-semibold
                "
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}