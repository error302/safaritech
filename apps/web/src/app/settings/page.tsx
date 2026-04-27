'use client'

import { useState } from 'react'
import { User, Lock, MapPin, Bell, CreditCard, Save } from 'lucide-react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payment', label: 'Payment', icon: CreditCard },
]

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="md:bg-safaridark bg-gray-50 min-h-screen py-6 md:py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="mb-6 md:mb-8 font-display font-bold text-2xl md:text-3xl md:text-white text-gray-900">Account Settings</h1>

        {/* Mobile tab pills */}
        <div className="md:hidden flex gap-2 overflow-x-auto scrollbar-none mb-6 pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-neon text-black'
                    : 'bg-white border border-gray-200 text-gray-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block md:w-48 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-neon/10 text-neon'
                      : 'text-gray-400 hover:text-white hover:bg-safarigray'
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
            <div className="rounded-xl border border-gray-200 md:border-safariborder bg-white md:bg-safarigray p-5 md:p-6">
              {activeTab === 'profile' && (
                <>
                  <h2 className="mb-5 text-base md:text-lg font-semibold text-gray-900 md:text-white">Profile Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">First Name</label>
                        <input
                          type="text"
                          defaultValue="John"
                          className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">Last Name</label>
                        <input
                          type="text"
                          defaultValue="Doe"
                          className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">Email</label>
                      <input
                        type="email"
                        defaultValue="john@example.com"
                        className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+254 700 000 000"
                        className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'password' && (
                <>
                  <h2 className="mb-5 text-base md:text-lg font-semibold text-gray-900 md:text-white">Change Password</h2>
                  <div className="space-y-4 max-w-md">
                    {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                      <div key={label}>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">{label}</label>
                        <input
                          type="password"
                          className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'addresses' && (
                <>
                  <h2 className="mb-5 text-base md:text-lg font-semibold text-gray-900 md:text-white">Saved Addresses</h2>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 md:border-safariborder p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-gray-900 md:text-white">Home</span>
                        <span className="text-xs bg-green-50 md:bg-neon/10 text-green-700 md:text-neon px-2 py-1 rounded">Default</span>
                      </div>
                      <p className="text-gray-500 md:text-gray-400 text-sm">123 Westlands Road<br />Nairobi, Kenya</p>
                    </div>
                    <button className="w-full border border-dashed border-gray-300 md:border-safariborder rounded-lg py-3 text-sm font-medium text-gray-500 md:text-gray-400 hover:border-neon hover:text-neon transition-colors">
                      Add New Address
                    </button>
                  </div>
                </>
              )}

              {activeTab === 'notifications' && (
                <>
                  <h2 className="mb-5 text-base md:text-lg font-semibold text-gray-900 md:text-white">Notification Preferences</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Order updates', desc: 'Get notified about order status changes' },
                      { label: 'Promotions & deals', desc: 'Receive promotional emails and special offers' },
                      { label: 'New products', desc: 'Be the first to know about new arrivals' },
                      { label: 'Newsletter', desc: 'Monthly tech news and tips' },
                    ].map((item, idx) => (
                      <label key={idx} className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 md:border-safariborder cursor-pointer hover:bg-gray-50 md:hover:bg-safaridark transition-colors">
                        <input type="checkbox" defaultChecked className="mt-1 rounded text-neon accent-neon" />
                        <div>
                          <p className="font-medium text-sm text-gray-900 md:text-white">{item.label}</p>
                          <p className="text-xs text-gray-500 md:text-gray-400">{item.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'payment' && (
                <>
                  <h2 className="mb-5 text-base md:text-lg font-semibold text-gray-900 md:text-white">Payment Methods</h2>
                  <div className="space-y-4">
                    <div className="rounded-lg border border-gray-200 md:border-safariborder p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-sm text-gray-900 md:text-white">M-Pesa</p>
                          <p className="text-xs text-gray-500 md:text-gray-400">+254 7XX XXX XXX</p>
                        </div>
                      </div>
                      <button className="text-xs text-red-500 hover:underline">Remove</button>
                    </div>
                    <button className="w-full border border-dashed border-gray-300 md:border-safariborder rounded-lg py-3 text-sm font-medium text-gray-500 md:text-gray-400 hover:border-neon hover:text-neon transition-colors">
                      Add Payment Method
                    </button>
                  </div>
                </>
              )}

              <div className="mt-6 pt-5 border-t border-gray-200 md:border-safariborder flex items-center gap-4">
                <button
                  onClick={handleSave}
                  className="bg-neon hover:bg-neon-dim text-black font-bold text-sm px-5 py-2.5 rounded-lg transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                {saved && (
                  <span className="text-sm text-green-600 md:text-green-400 font-medium">Changes saved!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
