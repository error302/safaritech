"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Package,
  ChevronLeft,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Loader2,
  MapPin,
} from "lucide-react";
import { trpc } from "@/utils/trpc";
import { formatDate } from "@/lib/utils";
import { formatPrice } from "@/lib/validation";

const statusConfig: Record<
  string,
  { label: string; icon: typeof Clock; color: string }
> = {
  PENDING: { label: "Pending", icon: Clock, color: "text-amber-600 md:text-yellow" },
  PROCESSING: { label: "Processing", icon: Package, color: "text-blue-600 md:text-blue" },
  SHIPPED: { label: "Shipped", icon: Truck, color: "text-purple-600 md:text-purple" },
  DELIVERED: { label: "Delivered", icon: CheckCircle, color: "text-green-600 md:text-neon" },
  CANCELLED: { label: "Cancelled", icon: XCircle, color: "text-red-600 md:text-red" },
};

export default function OrderDetail() {
  const params = useParams();
  const orderId = params.id as string;

  const { data: order, isLoading, error } = trpc.order.getById.useQuery(
    { id: orderId },
    { enabled: !!orderId }
  );

  if (isLoading) {
    return (
      <div className="bg-safaridark min-h-screen py-6 md:py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center py-24">
          <Loader2 className="mx-auto h-12 w-12 text-neon animate-spin mb-4" />
          <p className="text-gray-500 md:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="bg-safaridark min-h-screen py-6 md:py-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/orders"
            className="mb-6 inline-flex items-center text-sm text-gray-500 md:text-gray-400 hover:text-neon transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Orders
          </Link>
          <div className="bg-safarigray border border-safariborder rounded-xl p-8 md:p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-300 md:text-gray-600 mb-4" />
            <h2 className="mb-2 text-lg md:text-xl font-semibold text-white">Order Not Found</h2>
            <p className="text-sm text-gray-500 md:text-gray-400">
              This order could not be found or you do not have permission to view it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  return (
    <div className="bg-safaridark min-h-screen py-6 md:py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/orders"
          className="mb-6 inline-flex items-center text-sm text-gray-500 md:text-gray-400 hover:text-neon transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Orders
        </Link>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white">
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className="text-sm text-gray-500 md:text-gray-400 mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusIcon className={`h-5 w-5 ${status.color}`} />
            <span className={`font-semibold ${status.color}`}>{status.label}</span>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="bg-safarigray border border-safariborder rounded-xl p-6">
            <h2 className="font-semibold text-white mb-4">Items</h2>
            <ul className="space-y-4">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between items-start gap-4 border-b border-safariborder pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-white">{item.product.name}</p>
                    <p className="text-sm text-gray-500 md:text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-white shrink-0">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {order.shippingAddress && (
            <div className="bg-safarigray border border-safariborder rounded-xl p-6">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-neon" />
                Shipping Address
              </h2>
              <p className="text-gray-400">
                {order.shippingAddress.line1}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}
                <br />
                {order.shippingAddress.country}
                {order.shippingAddress.phone && (
                  <>
                    <br />
                    Phone: {order.shippingAddress.phone}
                  </>
                )}
              </p>
            </div>
          )}

          <div className="bg-safarigray border border-safariborder rounded-xl p-6">
            <h2 className="font-semibold text-white mb-4">Summary</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500 md:text-gray-400">Subtotal</dt>
                <dd className="text-white">{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500 md:text-gray-400">Shipping</dt>
                <dd className="text-white">{formatPrice(order.shipping)}</dd>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-gray-500 md:text-gray-400">Discount</dt>
                  <dd className="text-green-600 md:text-neon">-{formatPrice(order.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-safariborder font-bold text-base">
                <dt className="text-white">Total</dt>
                <dd className="text-neon">{formatPrice(order.total)}</dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-gray-500 md:text-gray-400">Payment</dt>
                <dd className="text-white capitalize">
                  {order.paymentMethod} · {order.paymentStatus}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
