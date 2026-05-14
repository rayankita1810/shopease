"use client";

import { useEffect, useMemo, useState } from "react";
import API from "@/lib/api";
import {
  Users,
  Mail,
  ShieldCheck,
  ShoppingBag,
  Store,
  CalendarDays,
  Search,
  Filter,
  Eye,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "user" | "seller" | "admin";
  createdAt: string;

  totalOrders: number;
  totalProducts: number;
  totalSpent: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (error) {
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // FILTER USERS
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // STATS
  const totalUsers = users.length;

  const totalCustomers = users.filter(
    (u) => u.role === "user"
  ).length;

  const totalSellers = users.filter(
    (u) => u.role === "seller"
  ).length;

  const totalAdmins = users.filter(
    (u) => u.role === "admin"
  ).length;

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";

      case "seller":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-green-100 text-green-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            
            {/* LEFT */}
            <div>
              <p className="text-blue-300 font-medium">
                User Management
              </p>

              <h1 className="text-4xl font-bold mt-2">
                All Users
              </h1>

              <p className="text-slate-300 mt-3 max-w-2xl">
                Manage customers, sellers, and administrators
                from one professional dashboard.
              </p>
            </div>

            {/* RIGHT */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 min-w-[280px]">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <Users size={28} className="text-blue-300" />
                </div>

                <div>
                  <p className="text-sm text-slate-300">
                    Total Users
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    {totalUsers}
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6 text-center">
                <div>
                  <p className="text-lg font-bold">
                    {totalCustomers}
                  </p>

                  <p className="text-xs text-slate-300">
                    Users
                  </p>
                </div>

                <div>
                  <p className="text-lg font-bold">
                    {totalSellers}
                  </p>

                  <p className="text-xs text-slate-300">
                    Sellers
                  </p>
                </div>

                <div>
                  <p className="text-lg font-bold">
                    {totalAdmins}
                  </p>

                  <p className="text-xs text-slate-300">
                    Admins
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* FILTERS */}
        <div className="bg-white border rounded-3xl p-5 shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">

            {/* SEARCH */}
            <div className="relative w-full lg:max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="
                  w-full
                  h-12
                  pl-11
                  pr-4
                  rounded-xl
                  border
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            </div>

            {/* FILTER */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-500">
                <Filter size={18} />

                <span className="text-sm font-medium">
                  Filter
                </span>
              </div>

              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value)
                }
                className="
                  h-12
                  px-4
                  rounded-xl
                  border
                  bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="seller">Sellers</option>
                <option value="admin">Admins</option>
              </select>
            </div>

          </div>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-14 w-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white border rounded-3xl p-16 text-center">
            <Users
              size={55}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-2xl font-bold mt-5">
              No Users Found
            </h2>

            <p className="text-gray-500 mt-2">
              No matching users available.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">

            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="
                  bg-white
                  border
                  rounded-3xl
                  shadow-sm
                  hover:shadow-xl
                  transition
                  overflow-hidden
                "
              >
                <div className="p-6">

                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                    {/* LEFT */}
                    <div className="flex items-start gap-4">

                      <div
                        className="
                          h-16
                          w-16
                          rounded-2xl
                          bg-blue-100
                          text-blue-700
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >
                        <Users size={28} />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {user.name}
                        </h2>

                        <div className="flex items-center gap-2 text-gray-500 mt-2">
                          <Mail size={16} />

                          <span className="break-all">
                            {user.email}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 mt-4">

                          <div
                            className={`
                              px-4
                              py-1.5
                              rounded-full
                              text-sm
                              font-semibold
                              capitalize
                              ${getRoleStyle(user.role)}
                            `}
                          >
                            {user.role}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <CalendarDays size={15} />

                            <span>
                              Joined{" "}
                              {new Date(
                                user.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </div>

                        </div>
                      </div>

                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-wrap gap-3">

                      {/* USER */}
                      {(user.role === "user" || user.role === "seller") && (
                        <>
                          <div className="bg-gray-100 rounded-2xl px-5 py-4 min-w-[140px]">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <ShoppingBag size={16} />

                              <span>Orders</span>
                            </div>

                            <p className="font-bold mt-2 text-lg">
                              {user.totalOrders}
                            </p>
                          </div>

                          <div className="bg-gray-100 rounded-2xl px-5 py-4 min-w-[160px]">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <ShieldCheck size={16} />

                              <span>Total Spent</span>
                            </div>

                            <p className="font-bold mt-2 text-lg">
                              ₹{user.totalSpent}
                            </p>
                          </div>
                        </>
                      )}

                      {/* SELLER */}
                      {user.role === "seller" && (
                        <>
                          <div className="bg-gray-100 rounded-2xl px-5 py-4 min-w-[140px]">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <Store size={16} />

                              <span>Products</span>
                            </div>

                            <p className="font-bold mt-2 text-lg">
                              {user.totalProducts}
                            </p>
                          </div>

                          <div className="bg-gray-100 rounded-2xl px-5 py-4 min-w-[140px]">
                            <div className="flex items-center gap-2 text-gray-500 text-sm">
                              <ShoppingBag size={16} />

                              <span>Got Orders</span>
                            </div>

                            <p className="font-bold mt-2 text-lg">
                              {user.totalOrders}
                            </p>
                          </div>
                        </>
                      )}

                      {/* ADMIN */}
                      {user.role === "admin" && (
                        <div className="bg-red-50 border border-red-100 rounded-2xl px-5 py-4 min-w-[200px]">
                          <div className="flex items-center gap-2 text-red-600 text-sm">
                            <ShieldCheck size={16} />

                            <span>Administrator</span>
                          </div>

                          <p className="font-bold mt-2 text-red-700">
                            Full Access Control
                          </p>
                        </div>
                      )}

                      {/* BUTTON */}
                      {/* <button
                        className="
                          h-[72px]
                          px-6
                          rounded-2xl
                          bg-slate-900
                          text-white
                          hover:bg-black
                          transition
                          flex
                          items-center
                          gap-2
                          font-medium
                        "
                      >
                        <Eye size={18} />
                        View Details
                      </button> */}

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