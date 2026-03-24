import Link from 'next/link'
import { Plus, Search, Edit, Trash2, MoreVertical } from 'lucide-react'

const products = [
  { id: '1', name: 'iPhone 15 Pro Max', category: 'phones', price: 149999, stock: 15, status: 'active' },
  { id: '2', name: 'MacBook Pro M3', category: 'laptops', price: 199999, stock: 8, status: 'active' },
  { id: '3', name: 'Sony WH-1000XM5', category: 'audio', price: 34999, stock: 25, status: 'active' },
]

export default function AdminProducts() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-muted">Manage your product catalog</p>
          </div>
          <Link href="/admin/products/new" className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 pl-10 text-text placeholder:text-muted focus:border-electric focus:outline-none"
              />
            </div>
          </div>

          <table className="w-full">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Price</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Stock</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-surface">
                  <td className="px-4 py-3 font-medium">{product.name}</td>
                  <td className="px-4 py-3 text-muted capitalize">{product.category}</td>
                  <td className="px-4 py-3">KSh {product.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={product.stock < 10 ? 'text-yellow' : 'text-muted'}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-green/10 px-2 py-1 text-xs font-medium text-green">
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted hover:text-electric">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-muted hover:text-red">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
