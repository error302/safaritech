import Link from 'next/link'
import { Package, ChevronLeft, CheckCircle, Clock, MapPin } from 'lucide-react'

export default function OrderDetail({ params }: { params: { id: string } }) {
  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-6 md:py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/orders"
          className="mb-6 inline-flex items-center text-sm text-gray-500 md:text-gray-400 hover:text-neon transition-colors"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Orders
        </Link>

        <div className="bg-white md:bg-safarigray border border-gray-200 md:border-safariborder rounded-xl p-8 md:p-12 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-300 md:text-gray-600 mb-4" />
          <h2 className="mb-2 text-lg md:text-xl font-semibold text-gray-900 md:text-white">Order Not Found</h2>
          <p className="text-sm text-gray-500 md:text-gray-400">This order could not be found.</p>
        </div>
      </div>
    </div>
  )
}
