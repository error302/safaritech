'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Upload, Plus, X } from 'lucide-react'

export default function AdminProductsNew() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: '', value: '' },
  ])

  const addSpec = () => {
    setSpecs([...specs, { key: '', value: '' }])
  }

  const removeSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index))
  }

  const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...specs]
    updated[index][field] = value
    setSpecs(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push('/admin/products')
    }, 1500)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/admin/products" className="mb-6 inline-flex items-center text-sm text-muted hover:text-electric">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted">Fill in the product details below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., iPhone 15 Pro Max"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-muted focus:border-electric focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Slug</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., iphone-15-pro-max"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-muted focus:border-electric focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Category</label>
                <select className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none">
                  <option value="">Select category</option>
                  <option value="phones">Smartphones</option>
                  <option value="laptops">Laptops</option>
                  <option value="audio">Audio</option>
                  <option value="wearables">Wearables</option>
                  <option value="tablets">Tablets</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Product description..."
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-muted focus:border-electric focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Pricing & Stock</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Price (KES)</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-muted focus:border-electric focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Sale Price (KES)</label>
                <input
                  type="number"
                  placeholder="Optional"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-muted focus:border-electric focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Stock Quantity</label>
                <input
                  type="number"
                  required
                  placeholder="0"
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-muted focus:border-electric focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Specifications</h2>
            <div className="space-y-3">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex gap-3">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => updateSpec(idx, 'key', e.target.value)}
                    placeholder="Key (e.g., Display)"
                    className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-muted focus:border-electric focus:outline-none"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => updateSpec(idx, 'value', e.target.value)}
                    placeholder="Value (e.g., 6.7 inch)"
                    className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-text placeholder:text-muted focus:border-electric focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(idx)}
                    className="p-2.5 rounded-lg border border-border text-muted hover:text-red hover:border-red transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSpec}
                className="flex items-center gap-2 text-sm text-electric hover:underline"
              >
                <Plus className="h-4 w-4" />
                Add Specification
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">Product Images</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted mb-4" />
              <p className="text-muted mb-2">Drag and drop images here or click to upload</p>
              <p className="text-sm text-muted">PNG, JPG up to 5MB each</p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <Link href="/admin/products" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
