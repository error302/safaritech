'use client'

import { useState, useEffect } from 'react'
import { User, Lock, MapPin, Bell, CreditCard, Save, Loader2, Trash2, Edit2, X, Check } from 'lucide-react'
import { trpc } from '@/utils/trpc'
import { useSession } from 'next-auth/react'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'password', label: 'Password', icon: Lock },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'payment', label: 'Payment', icon: CreditCard },
]

// Profile Tab Component
function ProfileTab() {
  const { data: user, isLoading } = trpc.user.me.useQuery()
  const utils = trpc.useUtils()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  // Initialize form when user data loads
  useEffect(() => {
    if (user) {
      const nameParts = user.name?.split(' ') || ['', '']
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  const updateProfile = trpc.user.updateProfile.useMutation({
    onSuccess: () => {
      utils.user.me.invalidate()
      setIsSuccess(true)
      setMessage('Profile updated successfully!')
      setTimeout(() => {
        setMessage('')
        setIsSuccess(false)
      }, 3000)
    },
    onError: (error) => {
      setIsSuccess(false)
      setMessage(error.message || 'Failed to update profile')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullName = `${formData.firstName} ${formData.lastName}`.trim()
    updateProfile.mutate({
      name: fullName,
      phone: formData.phone,
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-neon" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-5 text-base md:text-lg font-semibold text-gray-900 md:text-white">Profile Information</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
            />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">Email</label>
          <input
            type="email"
            value={formData.email}
            disabled
            className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-100 md:bg-safaridark/50 px-4 py-2.5 text-sm text-gray-500 md:text-gray-400 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500 md:text-gray-400">Email cannot be changed</p>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+254 700 000 000"
            className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
          />
        </div>
      </div>
      
      <div className="mt-6 pt-5 border-t border-gray-200 md:border-safariborder flex items-center gap-4">
        <button
          type="submit"
          disabled={updateProfile.isLoading}
          className="bg-neon hover:bg-neon-dim text-black font-bold text-sm px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {updateProfile.isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
        {message && (
          <span className={`text-sm font-medium ${isSuccess ? 'text-green-600 md:text-green-400' : 'text-red-600 md:text-red-400'}`}>
            {message}
          </span>
        )}
      </div>
    </form>
  )
}

// Password Tab Component
function PasswordTab() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.newPassword !== formData.confirmPassword) {
      setIsSuccess(false)
      setMessage('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 8) {
      setIsSuccess(false)
      setMessage('Password must be at least 8 characters')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setIsSuccess(true)
        setMessage('Password changed successfully!')
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setIsSuccess(false)
        setMessage(data.error || 'Failed to change password')
      }
    } catch (error) {
      setIsSuccess(false)
      setMessage('An error occurred. Please try again.')
    }
    setIsLoading(false)
    
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mb-5 text-base md:text-lg font-semibold text-gray-900 md:text-white">Change Password</h2>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">Current Password</label>
          <input
            type="password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">New Password</label>
          <input
            type="password"
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700 md:text-gray-300">Confirm New Password</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark px-4 py-2.5 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none focus:ring-2 focus:ring-neon/20"
          />
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-gray-200 md:border-safariborder flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-neon hover:bg-neon-dim text-black font-bold text-sm px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Update Password
        </button>
        {message && (
          <span className={`text-sm font-medium ${isSuccess ? 'text-green-600 md:text-green-400' : 'text-red-600 md:text-red-400'}`}>
            {message}
          </span>
        )}
      </div>
    </form>
  )
}

// Addresses Tab Component
function AddressesTab() {
  const { data: addresses, isLoading } = trpc.user.getAddresses.useQuery()
  const utils = trpc.useUtils()
  
  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<any>(null)
  const [formData, setFormData] = useState({
    label: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal: '',
    country: 'Kenya',
    phone: '',
  })
  const [message, setMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const addAddress = trpc.user.addAddress.useMutation({
    onSuccess: () => {
      utils.user.getAddresses.invalidate()
      setShowForm(false)
      resetForm()
      setIsSuccess(true)
      setMessage('Address added successfully!')
      setTimeout(() => setMessage(''), 3000)
    },
    onError: (error) => {
      setIsSuccess(false)
      setMessage(error.message || 'Failed to add address')
    },
  })

  const updateAddress = trpc.user.updateAddress.useMutation({
    onSuccess: () => {
      utils.user.getAddresses.invalidate()
      setEditingAddress(null)
      resetForm()
      setIsSuccess(true)
      setMessage('Address updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    },
    onError: (error) => {
      setIsSuccess(false)
      setMessage(error.message || 'Failed to update address')
    },
  })

  const deleteAddress = trpc.user.deleteAddress.useMutation({
    onSuccess: () => {
      utils.user.getAddresses.invalidate()
      setIsSuccess(true)
      setMessage('Address deleted successfully!')
      setTimeout(() => setMessage(''), 3000)
    },
    onError: (error) => {
      setIsSuccess(false)
      setMessage(error.message || 'Failed to delete address')
    },
  })

  const resetForm = () => {
    setFormData({
      label: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      postal: '',
      country: 'Kenya',
      phone: '',
    })
  }

  const handleEdit = (address: any) => {
    setEditingAddress(address)
    setFormData({
      label: address.label,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      state: address.state,
      postal: address.postal,
      country: address.country,
      phone: address.phone,
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingAddress) {
      updateAddress.mutate({ id: editingAddress.id, ...formData })
    } else {
      addAddress.mutate(formData)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingAddress(null)
    resetForm()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-neon" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 md:text-white">Saved Addresses</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-sm text-neon hover:text-neon-dim font-medium"
          >
            + Add Address
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${isSuccess ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 rounded-lg border border-gray-200 md:border-safariborder bg-gray-50 md:bg-safaridark">
          <h3 className="text-sm font-medium text-gray-900 md:text-white mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-gray-300">Label (e.g., Home, Work)</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-white md:bg-safaridark px-3 py-2 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-gray-300">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-white md:bg-safaridark px-3 py-2 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-gray-300">Address Line 1</label>
              <input
                type="text"
                value={formData.line1}
                onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-white md:bg-safaridark px-3 py-2 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-gray-300">Address Line 2 (Optional)</label>
              <input
                type="text"
                value={formData.line2}
                onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-white md:bg-safaridark px-3 py-2 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-gray-300">City</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-white md:bg-safaridark px-3 py-2 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-gray-300">State/County</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-white md:bg-safaridark px-3 py-2 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-gray-300">Postal Code</label>
              <input
                type="text"
                value={formData.postal}
                onChange={(e) => setFormData({ ...formData, postal: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-white md:bg-safaridark px-3 py-2 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700 md:text-gray-300">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
                className="w-full rounded-lg border border-gray-200 md:border-safariborder bg-white md:bg-safaridark px-3 py-2 text-sm text-gray-900 md:text-white focus:border-neon focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              type="submit"
              disabled={addAddress.isLoading || updateAddress.isLoading}
              className="bg-neon hover:bg-neon-dim text-black font-semibold text-sm px-4 py-2 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {(addAddress.isLoading || updateAddress.isLoading) && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingAddress ? 'Update Address' : 'Save Address'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="border border-gray-300 md:border-safariborder text-gray-700 md:text-gray-300 font-medium text-sm px-4 py-2 rounded-lg hover:bg-gray-50 md:hover:bg-safaridark transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {addresses && addresses.length > 0 ? (
          addresses.map((address) => (
            <div key={address.id} className="rounded-lg border border-gray-200 md:border-safariborder p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-gray-900 md:text-white">{address.label}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-1.5 text-gray-500 hover:text-neon transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteAddress.mutate({ id: address.id })}
                    disabled={deleteAddress.isLoading}
                    className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-500 md:text-gray-400 text-sm">
                {address.line1}
                {address.line2 && <>, {address.line2}</>}
                <br />
                {address.city}, {address.state} {address.postal}
                <br />
                {address.country}
                <br />
                <span className="text-gray-400">{address.phone}</span>
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 md:text-gray-400">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No addresses saved yet</p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 text-neon hover:underline text-sm"
              >
                Add your first address
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Notifications Tab Component
function NotificationsTab() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
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
    </>
  )
}

// Payment Tab Component
function PaymentTab() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
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
    </>
  )
}

// Main Settings Component
export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />
      case 'password':
        return <PasswordTab />
      case 'addresses':
        return <AddressesTab />
      case 'notifications':
        return <NotificationsTab />
      case 'payment':
        return <PaymentTab />
      default:
        return <ProfileTab />
    }
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
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
