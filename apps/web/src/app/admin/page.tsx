"use client";

import Link from "next/link";
import { DollarSign, ShoppingCart, Package, Users, ArrowUpRight, ArrowDownRight, Clock } from "lucide-react";
import { trpc } from "@/utils/trpc";
import { AdminStatCard } from "@/components/admin/AdminStatCard";

function formatKES(amount: number) {
  return `KSh ${(amount / 100).toLocaleString()}`;
}

function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const statusColors: Record<string, string> = {
  PENDING: 'text-yellow bg-yellow/10 border-yellow/20',
  PROCESSING: 'text-blue bg-blue/10 border-blue/20',
  SHIPPED: 'text-purple bg-purple/10 border-purple/20',
  DELIVERED: 'text-neon bg-neon/10 border-neon/20',
  CANCELLED: 'text-red-500 bg-red-500/10 border-red-500/20',
};

export default function AdminDashboardPage() {
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back! Here is what is happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          label="Total Revenue"
          value={formatKES(stats?.totalRevenue ?? 0)}
          change="+0% from last month"
          changeType="positive"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <AdminStatCard
          label="Total Orders"
          value={(stats?.totalOrders ?? 0).toString()}
          change={`${stats?.pendingOrders ?? 0} pending`}
          changeType="neutral"
          icon={<ShoppingCart className="w-5 h-5" />}
        />
        <AdminStatCard
          label="Products"
          value={(stats?.totalProducts ?? 0).toString()}
          icon={<Package className="w-5 h-5" />}
        />
        <AdminStatCard
          label="Customers"
          value={(stats?.totalUsers ?? 0).toString()}
          change="+0 this week"
          changeType="positive"
          icon={<Users className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-safarigray border border-safariborder rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-safariborder">
            <h2 className="font-display font-bold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-neon hover:underline">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-safariborder">
            {stats?.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-4 px-6 py-4 hover:bg-safaridark/50">
                  <div className="w-10 h-10 rounded-xl bg-safaridark flex items-center justify-center text-neon shrink-0">
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">
                        {order.user?.name || order.user?.email || 'Guest'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[order.status] || statusColors.PENDING}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.id.slice(0, 8)} • {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-white">
                      KSh {order.total.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                No orders yet
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-safarigray border border-safariborder rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-safariborder">
            <h2 className="font-display font-bold text-white">Top Products</h2>
            <Link href="/admin/products" className="text-sm text-neon hover:underline">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-safariborder">
            {stats?.topProducts && stats.topProducts.length > 0 ? (
              stats.topProducts.map((product, i) => (
                <div key={product.id} className="flex items-center gap-4 px-6 py-4 hover:bg-safaridark/50">
                  <div className="w-8 h-8 rounded-xl bg-neon/10 flex items-center justify-center text-neon shrink-0 text-sm font-bold">
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {product.orderCount} orders
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center text-gray-500">
                No products yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}