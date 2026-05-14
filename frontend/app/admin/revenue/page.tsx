"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import {
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  PackageCheck,
  CreditCard,
  Wallet,
  ArrowUpRight,
  Activity,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

interface RevenueStats {
  totalRevenue: number;
  totalOrders: number;
  paidOrders: number;
  pendingPayments: number;
  averageOrderValue: number;

  monthlyRevenue: {
    month: string;
    revenue: number;
  }[];

  topSellingProducts: {
    name: string;
    sales: number;
  }[];
}

export default function RevenuePage() {
  const [stats, setStats] = useState<RevenueStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async () => {
    try {
      const { data } = await API.get("/admin/revenue");
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center">
        <div className="text-center">
          <div className="h-14 w-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-5 text-gray-500 font-medium">
            Loading Revenue Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7fb]">

      {/* TOP SECTION */}
      <div className="px-6 py-8">

        <div className="max-w-7xl mx-auto">

          {/* HERO */}
          <div className="bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e3a8a] rounded-[35px] p-8 md:p-10 text-white relative overflow-hidden">

            <div className="absolute top-0 right-0 h-72 w-72 bg-blue-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

              {/* LEFT */}
              <div>

                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
                  <Activity size={15} />
                  Live Revenue Tracking
                </div>

                <h1 className="text-4xl md:text-5xl font-bold mt-5 leading-tight">
                  Revenue
                  <br />
                  Analytics Dashboard
                </h1>

                <p className="text-slate-300 mt-5 max-w-2xl text-lg">
                  Monitor growth, orders, platform performance,
                  and ecommerce sales insights from one dashboard.
                </p>

              </div>

              {/* RIGHT CARD */}
              <div className="bg-white text-black rounded-[28px] p-7 min-w-[320px] shadow-2xl">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">
                      Total Revenue
                    </p>

                    <h2 className="text-4xl font-black mt-2">
                      ₹{stats?.totalRevenue?.toLocaleString()}
                    </h2>
                  </div>

                  <div className="h-14 w-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
                    <TrendingUp />
                  </div>
                </div>

                <div className="mt-7 grid grid-cols-2 gap-4">

                  <MiniBox
                    title="Orders"
                    value={stats?.totalOrders || 0}
                  />

                  <MiniBox
                    title="Paid"
                    value={stats?.paidOrders || 0}
                  />

                </div>

                <div className="mt-5 bg-green-50 text-green-700 px-4 py-3 rounded-2xl flex items-center justify-between">
                  <span className="font-semibold text-sm">
                    Platform Growing
                  </span>

                  <ArrowUpRight size={18} />
                </div>

              </div>

            </div>

          </div>

          {/* STAT GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

            <StatsCard
              title="Total Revenue"
              value={`₹${stats?.totalRevenue?.toLocaleString()}`}
              icon={<IndianRupee size={22} />}
              bg="bg-blue-600"
            />

            <StatsCard
              title="Total Orders"
              value={stats?.totalOrders || 0}
              icon={<ShoppingCart size={22} />}
              bg="bg-violet-600"
            />

            <StatsCard
              title="Pending Payments"
              value={stats?.pendingPayments || 0}
              icon={<Wallet size={22} />}
              bg="bg-orange-500"
            />

            <StatsCard
              title="Average Order"
              value={`₹${stats?.averageOrderValue?.toFixed(0)}`}
              icon={<CreditCard size={22} />}
              bg="bg-green-600"
            />

          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">

            {/* LINE CHART */}
            <div className="xl:col-span-2 bg-white rounded-[30px] p-7 shadow-sm border border-gray-100">

              <div className="flex items-center justify-between mb-8">

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Revenue Performance
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Monthly growth overview
                  </p>
                </div>

                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-sm font-semibold">
                  Last 12 Months
                </div>

              </div>

              <div className="h-[350px]">

                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.monthlyRevenue}>

                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                    />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#2563eb"
                      strokeWidth={4}
                      dot={{ r: 5 }}
                    />

                  </LineChart>
                </ResponsiveContainer>

              </div>

            </div>

            {/* SIDE PANEL */}
            <div className="bg-[#111827] rounded-[30px] p-7 text-white relative overflow-hidden">

              <div className="absolute -bottom-16 -right-16 h-52 w-52 bg-blue-500/10 rounded-full"></div>

              <div className="relative z-10">

                <div className="flex items-center gap-3 mb-8">
                  <PackageCheck className="text-green-400" />

                  <h2 className="text-2xl font-bold">
                    Revenue Summary
                  </h2>
                </div>

                <div className="space-y-5">

                  <SummaryCard
                    label="Total Revenue"
                    value={`₹${stats?.totalRevenue?.toLocaleString()}`}
                  />

                  <SummaryCard
                    label="Paid Orders"
                    value={stats?.paidOrders || 0}
                  />

                  <SummaryCard
                    label="Pending Payments"
                    value={stats?.pendingPayments || 0}
                  />

                  <SummaryCard
                    label="Average Order"
                    value={`₹${stats?.averageOrderValue?.toFixed(0)}`}
                  />

                </div>

                <div className="mt-8 bg-white/10 border border-white/10 rounded-2xl p-5">

                  <p className="text-sm text-slate-300 leading-relaxed">
                    Revenue is automatically calculated from successful
                    paid orders across your ecommerce platform.
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* PRODUCTS */}
          <div className="bg-white rounded-[30px] p-7 shadow-sm border border-gray-100 mt-8">

            <div className="flex items-center justify-between mb-8">

              <div>
                <h2 className="text-2xl font-bold">
                  Top Selling Products
                </h2>

                <p className="text-gray-500 mt-1">
                  Best performing products by sales
                </p>
              </div>

            </div>

            <div className="h-[400px]">

              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.topSellingProducts}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="sales"
                    radius={[12, 12, 0, 0]}
                    fill="#4f46e5"
                  />

                </BarChart>
              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

function StatsCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-[28px] p-6 shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-gray-500 text-sm font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-black text-gray-900 mt-3">
            {value}
          </h2>

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
            ${bg}
          `}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">

      <p className="text-slate-400 text-sm">
        {label}
      </p>

      <h3 className="text-2xl font-bold mt-2">
        {value}
      </h3>

    </div>
  );
}

function MiniBox({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4">

      <p className="text-gray-500 text-sm">
        {title}
      </p>

      <h3 className="text-2xl font-bold mt-2">
        {value}
      </h3>

    </div>
  );
}