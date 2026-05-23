"use client";

import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { trpc } from "@/utils/trpc";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

function formatKES(amount: number) {
  return `KSh ${(amount / 100).toLocaleString()}`;
}

// ─── Custom Tooltip for Revenue Chart ────────────────────────────────────────
function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-safaridark border border-safariborder rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-display font-bold text-neon">
        {formatKES(payload[0].value)}
      </p>
    </div>
  );
}

// ─── Custom Tooltip for Bar Charts ───────────────────────────────────────────
function BarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; payload?: { count: number } }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-safaridark border border-safariborder rounded-lg px-3 py-2 shadow-xl">
      <p className="text-sm text-white font-medium">{label}</p>
      <p className="text-xs text-gray-400">{payload[0].value} orders</p>
    </div>
  );
}

// ─── Status color map ────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  PENDING: { color: "#FBBF24", label: "Pending" },
  PROCESSING: { color: "#00B8FF", label: "Processing" },
  SHIPPED: { color: "#A78BFA", label: "Shipped" },
  DELIVERED: { color: "#00FF9F", label: "Delivered" },
  CANCELLED: { color: "#F87171", label: "Cancelled" },
};

// ─── Payment method color map ────────────────────────────────────────────────
const PAYMENT_CONFIG: Record<string, { color: string; label: string }> = {
  mpesa: { color: "#00FF9F", label: "M-Pesa" },
  card: { color: "#00B8FF", label: "Card (Stripe)" },
  paypal: { color: "#A78BFA", label: "PayPal" },
  cod: { color: "#FBBF24", label: "Cash on Delivery" },
};

// ─── Custom Pie Label ────────────────────────────────────────────────────────
/* eslint-disable */
const RADIAN = Math.PI / 180;
function renderCustomizedLabel(props: any) {
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const midAngle = Number(props.midAngle ?? 0);
  const innerRadius = Number(props.innerRadius ?? 0);
  const outerRadius = Number(props.outerRadius ?? 0);
  const percent = Number(props.percent ?? 0);

  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function AdminAnalyticsPage() {
  const { data: stats, isLoading } = trpc.order.adminGetStats.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-safarigray border border-safariborder rounded-2xl p-6 h-28 animate-pulse"
              />
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="bg-safarigray border border-safariborder rounded-2xl p-6 h-80 animate-pulse"
              />
            ))}
        </div>
      </div>
    );
  }

  const orders = stats?.totalOrders ?? 0;
  const revenue = stats?.totalRevenue ?? 0;
  const pending = stats?.pendingOrders ?? 0;
  const products = stats?.totalProducts ?? 0;
  const users = stats?.totalUsers ?? 0;

  // Prepare status chart data
  const statusData = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    name: cfg.label,
    count: stats?.ordersByStatus?.[key] ?? 0,
    color: cfg.color,
    percentage: orders > 0 ? ((stats?.ordersByStatus?.[key] ?? 0) / orders) * 100 : 0,
  }));

  // Prepare payment method chart data
  const paymentData = Object.entries(PAYMENT_CONFIG)
    .map(([key, cfg]) => ({
      name: cfg.label,
      value: stats?.ordersByPaymentMethod?.[key] ?? 0,
      color: cfg.color,
      key,
    }))
    .filter((d) => d.value > 0);

  // Fallback if no payment data at all
  const paymentChartData =
    paymentData.length > 0
      ? paymentData
      : Object.entries(PAYMENT_CONFIG).map(([key, cfg]) => ({
          name: cfg.label,
          value: 0,
          color: cfg.color,
          key,
        }));

  // Prepare top products chart data
  const topProductsData = (stats?.topProducts ?? []).map((p) => ({
    name: p.name.length > 20 ? p.name.slice(0, 20) + "…" : p.name,
    fullName: p.name,
    orders: p.orderCount,
  }));

  // Monthly revenue data
  const revenueData = stats?.monthlyRevenue ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
          Analytics
        </h1>
        <p className="text-sm text-gray-500 mt-1">Store performance metrics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          label="Total Revenue"
          value={formatKES(revenue)}
          change="Lifetime earnings"
          changeType="positive"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <AdminStatCard
          label="Total Orders"
          value={orders.toString()}
          change={`${pending} pending`}
          changeType="neutral"
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <AdminStatCard
          label="Products"
          value={products.toString()}
          icon={<Package className="w-5 h-5" />}
        />
        <AdminStatCard
          label="Registered Users"
          value={users.toString()}
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      {/* Row 1: Revenue Overview + Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Overview */}
        <div className="bg-safarigray border border-safariborder rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-1">
            Revenue Overview
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Monthly revenue from paid orders (last 6 months)
          </p>
          <div className="h-64">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00FF9F" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00FF9F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1F1F1F"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6B7280", fontSize: 12 }}
                    tickFormatter={(v: number) =>
                      v >= 1000 ? `KSh ${(v / 1000).toFixed(0)}k` : `KSh ${v}`
                    }
                  />
                  <Tooltip content={<RevenueTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#00FF9F"
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                    dot={{ fill: "#00FF9F", r: 4, strokeWidth: 0 }}
                    activeDot={{ fill: "#00FF9F", r: 6, stroke: "#0A0A0A", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-600">
                <p className="text-sm">No revenue data yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Orders by Status */}
        <div className="bg-safarigray border border-safariborder rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-1">
            Orders by Status
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Distribution of all {orders} orders
          </p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={statusData}
                layout="vertical"
                margin={{ left: 0, right: 30, top: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1F1F1F"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#6B7280", fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 13 }}
                  width={90}
                />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Percentage labels below the chart */}
          <div className="flex flex-wrap gap-3 mt-4">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-xs text-gray-400">
                  {s.name}{" "}
                  <span className="text-gray-600">
                    ({s.percentage.toFixed(1)}%)
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Payment Methods + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Distribution */}
        <div className="bg-safarigray border border-safariborder rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-1">
            Payment Methods
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Orders by payment method
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-56 h-56 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={false}
                    stroke="none"
                  >
                    {paymentChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [
                      `${value} orders`,
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "#0A0A0A",
                      border: "1px solid #1F1F1F",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend with counts */}
            <div className="space-y-3 flex-1">
              {paymentChartData.map((method) => {
                const totalPaymentOrders = paymentChartData.reduce(
                  (sum, m) => sum + m.value,
                  0
                );
                const pct =
                  totalPaymentOrders > 0
                    ? ((method.value / totalPaymentOrders) * 100).toFixed(1)
                    : "0.0";
                return (
                  <div key={method.key} className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-sm shrink-0"
                      style={{ backgroundColor: method.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white font-medium">
                          {method.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                          {method.value} orders
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 bg-safaridark rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: method.color,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 w-12 text-right">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-safarigray border border-safariborder rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-1">
            Top Selling Products
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            By number of orders
          </p>
          {topProductsData.length > 0 ? (
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {topProductsData.map((product, i) => {
                const maxOrders = Math.max(
                  ...topProductsData.map((p) => p.orders),
                  1
                );
                const barWidth = (product.orders / maxOrders) * 100;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-neon/10 flex items-center justify-center text-neon text-xs font-bold shrink-0">
                          #{i + 1}
                        </div>
                        <span
                          className="text-sm text-white font-medium truncate"
                          title={product.fullName}
                        >
                          {product.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400 shrink-0 ml-2">
                        {product.orders} orders
                      </span>
                    </div>
                    <div className="h-3 bg-safaridark rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: i === 0 ? "#00FF9F" : i === 1 ? "#00CC7A" : "#009960",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center">
              <p className="text-gray-500 text-sm">No sales data yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
