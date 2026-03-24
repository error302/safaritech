'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, Search } from 'lucide-react'

const posts = [
  { id: '1', title: 'Best Smartphones to Buy in 2024', category: 'Smartphones', status: 'published', date: '2024-01-20' },
  { id: '2', title: 'Complete Laptop Buying Guide', category: 'Laptops', status: 'published', date: '2024-01-18' },
  { id: '3', title: 'Wireless Earbuds Comparison', category: 'Audio', status: 'draft', date: '2024-01-15' },
]

export default function AdminBlog() {
  const [filter, setFilter] = useState('all')

  const filteredPosts = filter === 'all' 
    ? posts 
    : posts.filter(p => p.status === filter)

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Blog Posts</h1>
            <p className="text-muted">Manage your blog content</p>
          </div>
          <button className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" /> New Post
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2 rounded-lg border border-border bg-card p-1">
            {['all', 'published', 'draft'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-md px-4 py-1.5 text-sm capitalize transition-colors ${
                  filter === status
                    ? 'bg-electric text-charcoal'
                    : 'text-muted hover:text-text'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 pl-10 text-text placeholder:text-muted focus:border-electric focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Date</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-surface">
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3 text-muted">{post.category}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${
                      post.status === 'published' ? 'text-green' : 'text-yellow'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{post.date}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted hover:text-electric">
                        <Eye className="h-4 w-4" />
                      </button>
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
