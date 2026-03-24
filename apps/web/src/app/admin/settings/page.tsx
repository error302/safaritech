'use client'

import { useState } from 'react'
import { Store, Truck, CreditCard, Bell, Shield, Globe } from 'lucide-react'

const tabs = [
  { id: 'general', label: 'General', icon: Store },
  { id: 'shipping', label: 'Shipping', icon: Truck },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
]

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Store Settings</h1>
          <p className="text-muted">Configure your store settings</p>
        </div>

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
              {activeTab === 'general' && (
                <>
                  <h2 className="mb-6 text-lg font-semibold">General Settings</h2>
                  <div className="space-y-4 max-w-lg">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Store Name</label>
                      <input
                        type="text"
                        defaultValue="Safaritech"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Store Email</label>
                      <input
                        type="email"
                        defaultValue="hello@safaritech.co.ke"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Store Phone</label>
                      <input
                        type="tel"
                        defaultValue="+254 700 000 000"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Currency</label>
                      <select className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none">
                        <option value="KES">Kenyan Shilling (KES)</option>
                        <option value="USD">US Dollar (USD)</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'shipping' && (
                <>
                  <h2 className="mb-6 text-lg font-semibold">Shipping Settings</h2>
                  <div className="space-y-4 max-w-lg">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Free Shipping Threshold (KES)</label>
                      <input
                        type="number"
                        defaultValue="10000"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Nairobi Delivery Fee (KES)</label>
                      <input
                        type="number"
                        defaultValue="500"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">COD Fee (KES)</label>
                      <input
                        type="number"
                        defaultValue="200"
                        className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text focus:border-electric focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'payments' && (
                <>
                  <h2 className="mb-6 text-lg font-semibold">Payment Settings</h2>
                  <div className="space-y-4 max-w-lg">
                    <div className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">M-Pesa</h3>
                          <p className="text-sm text-muted">Mobile payment via Safaricom</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-electric"></div>
                        </label>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Card Payments</h3>
                          <p className="text-sm text-muted">Visa & Mastercard via Stripe</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-electric"></div>
                        </label>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Cash on Delivery</h3>
                          <p className="text-sm text-muted">Pay when you receive</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-electric"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'notifications' && (
                <>
                  <h2 className="mb-6 text-lg font-semibold">Notification Settings</h2>
                  <div className="space-y-4 max-w-lg">
                    {[
                      { label: 'New Order', desc: 'Notify when new orders are placed' },
                      { label: 'Low Stock', desc: 'Alert when products are running low' },
                      { label: 'New Review', desc: 'Notify when customers leave reviews' },
                      { label: 'Daily Summary', desc: 'Daily sales and order summary' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">{item.label}</h3>
                            <p className="text-sm text-muted">{item.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked className="sr-only peer" />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-electric"></div>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="mt-6 pt-6 border-t border-border flex items-center gap-4">
                <button onClick={handleSave} className="btn btn-primary">
                  Save Changes
                </button>
                {saved && (
                  <span className="text-sm text-green">Settings saved successfully!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
