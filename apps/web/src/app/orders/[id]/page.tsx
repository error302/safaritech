import Link from 'next/link'
import { Package, Truck, CheckCircle, Clock, MapPin, ChevronLeft } from 'lucide-react'

const order = {
  id: 'ORD-ABC123',
  date: '2024-01-20',
  status: 'delivered',
  total: 139999,
  shipping: 0,
  paymentMethod: 'M-Pesa',
  shippingAddress: {
    name: 'John Doe',
    line1: '123 Westlands',
    city: 'Nairobi',
    county: 'Nairobi',
  },
  items: [
    { name: 'iPhone 15 Pro Max', quantity: 1, price: 139999 },
  ],
  timeline: [
    { status: 'Order Placed', date: 'Jan 20, 2024 - 10:30 AM', completed: true },
    { status: 'Payment Confirmed', date: 'Jan 20, 2024 - 10:35 AM', completed: true },
    { status: 'Processing', date: 'Jan 21, 2024 - 9:00 AM', completed: true },
    { status: 'Shipped', date: 'Jan 22, 2024 - 2:00 PM', completed: true },
    { status: 'Delivered', date: 'Jan 23, 2024 - 11:00 AM', completed: true },
  ],
}

export default function OrderDetail({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/orders" className="mb-6 inline-flex items-center text-sm text-muted hover:text-electric">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Order {order.id}</h1>
            <p className="text-muted">Placed on {order.date}</p>
          </div>
          <div className="flex items-center gap-2 text-green">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">Delivered</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Delivery Progress</h2>
              <div className="space-y-6">
                {order.timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {item.completed ? (
                        <CheckCircle className="h-5 w-5 text-green" />
                      ) : (
                        <Clock className="h-5 w-5 text-muted" />
                      )}
                      {idx < order.timeline.length - 1 && (
                        <div className={`w-0.5 h-8 ${item.completed ? 'bg-green' : 'bg-border'}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <p className={`font-medium ${item.completed ? 'text-text' : 'text-muted'}`}>
                        {item.status}
                      </p>
                      <p className="text-sm text-muted">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">KSh {item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Summary */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span>KSh {order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span>{order.shipping === 0 ? 'FREE' : `KSh ${order.shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Payment</span>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="border-t border-border pt-2 flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-electric">KSh {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Shipping Address</h2>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted mt-0.5" />
                <div>
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="text-sm text-muted">{order.shippingAddress.line1}</p>
                  <p className="text-sm text-muted">{order.shippingAddress.city}, {order.shippingAddress.county}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
