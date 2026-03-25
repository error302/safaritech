import { z } from 'zod'

export const schemas = {
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?254\d{9}$/, 'Invalid Kenya phone number'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  price: z.number().int().positive('Price must be positive'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
}

export function validatePhone(phone: string): boolean {
  return /^\+?254\d{9}$/.test(phone)
}

export function formatPrice(amount: number): string {
  return `KSh ${amount.toLocaleString()}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
