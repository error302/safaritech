"use client";

import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

function formatKES(amount: number) {
  return `KSh ${(amount / 100).toLocaleString()}`;
}

export default function AdminAnalyticsPage() {
  const { data: stats, isLoading } = trpc.order.adminGetStats.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="bg-safarigray border border-safariborder rounded-2xl p-6 h-28 animate-pulse" />
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Store performance metrics</p>
      </div>

      {/* Stats */}
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

      {/* Placeholder for charts - can be extended with recharts or chart.js later */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-safarigray border border-safariborder rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-4">Revenue Trend</h2>
          <div className="h-64 flex items-center justify-center text-gray-600 border-2 border-dashed border-safariborder rounded-xl">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Chart area</p>
              <p className="text-xs text-gray-600">Install recharts or chart.js to enable charts</p>
            </div>
          </div>
        </div>

        <div className="bg-safarigray border border-safariborder rounded-2xl p-6">
          <h2 className="font-display font-bold text-white mb-4">Orders by Status</h2>
          <div className="space-y-4">
            {[
              { label: "Pending", count: stats?.recentOrders?.filter(o => o.status === "PENDING").length ?? 0, color: "bg-yellow" },
              { label: "Processing", count: stats?.recentOrders?.filter(o => o.status === "PROCESSING").length ?? 0, color: "bg-blue" },
              { label: "Shipped", count: stats?.recentOrders?.filter(o => o.status === "SHIPPED").length ?? 0, color: "bg-purple" },
              { label: "Delivered", count: stats?.recentOrders?.filter(o => o.status === "DELIVERED").length ?? 0, color: "bg-neon" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-white font-medium">{item.count}</span>
                </div>
                <div className="h-2 bg-safaridark rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: orders > 0 ? `${(item.count / Math.max(orders, 1)) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-safarigray border border-safariborder rounded-2xl p-6">
        <h2 className="font-display font-bold text-white mb-4">Top Selling Products</h2>
        <div className="space-y-3">
          {stats?.topProducts?.length ? (
            stats.topProducts.map((product, i) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-neon/10 flex items-center justify-center text-neon text-sm font-bold shrink-0">
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{product.name}</p>
                </div>
                <div className="text-sm text-gray-500">{product.orderCount} orders</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No sales data yet</p>
          )}
        </div>
      </div>
    </div>
  );
}