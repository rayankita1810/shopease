"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import Link from "next/link";
import {
  Users,
  Package,
  Clock3,
  ShoppingCart,
  IndianRupee,
  ArrowRight,
  TrendingUp,
  Activity,
} from "lucide-react";

interface Stats {
  totalUsers: number;
  totalProducts: number;
  pendingProducts: number;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/admin/stats");
      // console.log(data);
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-14 w-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-500 font-medium">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* TOP HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* LEFT */}
            <div>
              <p className="text-blue-300 font-medium mb-2">
                Welcome Back 👋
              </p>

              <h1 className="text-4xl font-bold">
                Admin Dashboard
              </h1>

              <p className="text-slate-300 mt-3 max-w-2xl">
                Monitor products, orders, revenue, and platform activity
                from one powerful dashboard.
              </p>
            </div>

            {/* RIGHT */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl p-6 min-w-[280px]">
              <div className="flex items-center gap-3">
                <Activity className="text-green-400" />

                <div>
                  <p className="text-sm text-slate-300">
                    Platform Status
                  </p>

                  <h3 className="font-bold text-lg">
                    Running Smoothly
                  </h3>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Revenue
                  </p>

                  <h2 className="text-3xl font-bold mt-1">
                    ₹{stats?.totalRevenue}
                  </h2>
                </div>

                <div className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                  <TrendingUp size={14} />
                  Active
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">

          <DashboardCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<Users size={24} />}
            color="blue"
            href="/admin/users"
            description="Manage all users"
          />

          <DashboardCard
            title="Products"
            value={stats?.totalProducts || 0}
            icon={<Package size={24} />}
            color="purple"
            href="/admin/products"
            description="View all products"
          />

          <DashboardCard
            title="Pending"
            value={stats?.pendingProducts || 0}
            icon={<Clock3 size={24} />}
            color="orange"
            href="/admin/products/pending"
            description="Approve products"
          />

          <DashboardCard
            title="Orders"
            value={stats?.totalOrders || 0}
            icon={<ShoppingCart size={24} />}
            color="green"
            href="/admin/orders"
            description="Manage orders"
          />

          <DashboardCard
            title="Revenue"
            value={`₹${stats?.totalRevenue || 0}`}
            icon={<IndianRupee size={24} />}
            color="pink"
            href="/admin/revenue"
            description="Revenue analytics"
          />

        </div>

        {/* QUICK ACTIONS */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border shadow-sm">

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  Quick Actions
                </h2>

                <p className="text-gray-500 mt-1">
                  Manage your ecommerce platform faster
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">

              <QuickAction
                title="Manage Products"
                description="Approve, reject and manage products"
                href="/admin/products"
                color="blue"
              />

              <QuickAction
                title="View Orders"
                description="Track all customer orders"
                href="/admin/orders"
                color="green"
              />

              <QuickAction
                title="Pending Approvals"
                description="Review seller product requests"
                href="/admin/products/pending"
                color="orange"
              />

              <QuickAction
                title="Platform Users"
                description="View users and sellers"
                href="/admin/users"
                color="purple"
              />

            </div>

          </div>

          {/* RIGHT */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden">

            <div className="absolute -top-10 -right-10 h-40 w-40 bg-white/10 rounded-full"></div>

            <div className="relative z-10">

              <p className="text-blue-100">
                Platform Overview
              </p>

              <h2 className="text-3xl font-bold mt-3 leading-tight">
                Grow your business with better insights
              </h2>

              <p className="mt-4 text-blue-100">
                Track performance, manage sellers, and control your ecommerce
                ecosystem professionally.
              </p>

              <Link
                href="/admin/orders"
                className="
                  inline-flex
                  items-center
                  gap-2
                  mt-8
                  bg-white
                  text-blue-700
                  px-5
                  py-3
                  rounded-2xl
                  font-semibold
                  hover:scale-105
                  transition
                "
              >
                Explore Dashboard
                <ArrowRight size={18} />
              </Link>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  color,
  href,
  description,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  href: string;
  description: string;
}) {
  const colorMap: any = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    green: "from-green-500 to-green-600",
    pink: "from-pink-500 to-pink-600",
  };

  return (
    <Link
      href={href}
      className="
        group
        bg-white
        rounded-3xl
        p-6
        border
        shadow-sm
        hover:shadow-2xl
        hover:-translate-y-1
        transition-all
        duration-300
      "
    >

      <div className="flex items-start justify-between">

        <div>
          <p className="text-gray-500 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3 text-gray-900">
            {value}
          </h2>

          <p className="text-sm text-gray-400 mt-3">
            {description}
          </p>
        </div>

        <div
          className={`
            h-14
            w-14
            rounded-2xl
            flex
            items-center
            justify-center
            text-white
            bg-gradient-to-br
            ${colorMap[color]}
          `}
        >
          {icon}
        </div>

      </div>

      <div className="mt-6 flex items-center text-sm font-semibold text-blue-600">
        View Details

        <ArrowRight
          size={16}
          className="ml-2 group-hover:translate-x-1 transition"
        />
      </div>

    </Link>
  );
}

function QuickAction({
  title,
  description,
  href,
  color,
}: {
  title: string;
  description: string;
  href: string;
  color: string;
}) {
  const colorMap: any = {
    blue: "hover:border-blue-500",
    green: "hover:border-green-500",
    orange: "hover:border-orange-500",
    purple: "hover:border-purple-500",
  };

  return (
    <Link
      href={href}
      className={`
        border
        rounded-2xl
        p-5
        hover:shadow-lg
        transition
        ${colorMap[color]}
      `}
    >
      <h3 className="font-bold text-lg">
        {title}
      </h3>

      <p className="text-gray-500 text-sm mt-2">
        {description}
      </p>

      <div className="flex items-center gap-2 mt-5 text-blue-600 font-semibold text-sm">
        Open
        <ArrowRight size={15} />
      </div>
    </Link>
  );
}