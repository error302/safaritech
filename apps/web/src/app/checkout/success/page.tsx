import Link from 'next/link'
import { CheckCircle, Package, Mail, Download } from 'lucide-react'

export default function CheckoutSuccess() {
  const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()

  return (
    <div className="min-h-screen py-16 flex items-center justify-center">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green/10">
          <CheckCircle className="h-12 w-12 text-green" />
        </div>

        <h1 className="mb-4 text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted mb-6">
          Thank you for your purchase. We&apos;ve sent a confirmation email with your order details.
        </p>

        <div className="rounded-xl border border-border bg-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-muted">Order ID</span>
            <span className="font-mono font-bold text-electric">{orderId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Status</span>
            <span className="inline-flex items-center gap-1 text-green">
              <CheckCircle className="h-4 w-4" />
              Confirmed
            </span>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 rounded-lg bg-electric/10 p-4 text-left">
            <Mail className="h-5 w-5 text-electric flex-shrink-0" />
            <p className="text-sm">
              Check your email for order confirmation and delivery updates
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-card border border-border p-4 text-left">
            <Package className="h-5 w-5 text-electric flex-shrink-0" />
            <p className="text-sm">
              Track your order in real-time from our warehouse to your doorstep
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/orders" className="btn btn-primary">
            View My Orders
          </Link>
          <Link href="/shop" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
