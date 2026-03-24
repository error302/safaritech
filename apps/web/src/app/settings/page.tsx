'use client'

import { useState } from 'react'
import { User, Lock, MapPin, Bell, CreditCard } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payment', label: 'Payment Methods', icon: CreditCard },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold">Account Settings</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-48 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-electric/10 text-electric'
                      : 'text-muted hover:text-text hover:bg-card'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1">
            <div className="rounded-xl border border-border bg-card p-6">
              {activeTab === 'profile' && (
                <>
                  <h2 className="mb-6 text-lg font-semibold">Profile Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="mb-2 block text-sm font-medium">First Name</label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-sm font-medium">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Email</label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+254 700 000 000"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'password' && (
                <>
                  <h2 className="mb-6 text-lg font-semibold">Change Password</h2>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Current Password</label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">New Password</label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Confirm New Password</label>
                      <input
                        type="password"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'addresses' && (
                <>
                  <h2 className="mb-6 text-lg font-semibold">Saved Addresses</h2>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">Home</span>
                        <span className="text-xs bg-electric/10 text-electric px-2 py-1 rounded">Default</span>
                      </div>
                      <p className="text-muted text-sm">123 Westlands Road<br />Nairobi, Kenya</p>
                    </div>
                    <button className="btn btn-secondary">Add New Address</button>
                  </div>
                </>
              )}

              {activeTab === 'notifications' && (
                <>
                  <h2 className="mb-6 text-lg font-semibold">Notification Preferences</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Order updates', desc: 'Get notified about order status changes' },
                      { label: 'Promotions & deals', desc: 'Receive promotional emails and special offers' },
                      { label: 'New products', desc: 'Be the first to know about new arrivals' },
                      { label: 'Newsletter', desc: 'Monthly tech news and tips' },
                    ].map((item, idx) => (
                      <label key={idx} className="flex items-start gap-3 p-4 rounded-lg border border-border cursor-pointer hover:bg-surface">
                        <input type="checkbox" defaultChecked className="mt-1 rounded text-electric" />
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-sm text-muted">{item.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'payment' && (
                <>
                  <h2 className="mb-6 text-lg font-semibold">Payment Methods</h2>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-6 w-6 text-muted" />
                        <div>
                          <p className="font-medium">•••• •••• •••• 4242</p>
                          <p className="text-sm text-muted">Expires 12/25</p>
                        </div>
                      </div>
                      <button className="text-sm text-red hover:underline">Remove</button>
                    </div>
                    <button className="btn btn-secondary">Add Payment Method</button>
                  </div>
                </>
              )}

              <div className="mt-6 pt-6 border-t border-border flex items-center gap-4">
                <button onClick={handleSave} className="btn btn-primary">
                  Save Changes
                </button>
                {saved && (
                  <span className="text-sm text-green">Changes saved successfully!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
