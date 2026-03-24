import { Search, MoreVertical } from 'lucide-react'

const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', joined: '2024-01-15' },
  { id: '2', name: 'Sarah Kimani', email: 'sarah@example.com', role: 'customer', joined: '2024-01-20' },
  { id: '3', name: 'David Ochieng', email: 'david@example.com', role: 'customer', joined: '2024-01-22' },
]

export default function AdminUsers() {
  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted">Manage customer accounts</p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 pl-10 text-text placeholder:text-muted focus:border-electric focus:outline-none"
              />
            </div>
          </div>

          <table className="w-full">
            <thead className="border-b border-border bg-surface">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted">Joined</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-muted">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`capitalize ${user.role === 'admin' ? 'text-electric' : 'text-muted'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{user.joined}</td>
                  <td className="px-4 py-3 text-right">
                    <button className="p-2 text-muted hover:text-electric">
                      <MoreVertical className="h-4 w-4" />
                    </button>
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
