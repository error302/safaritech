import { validatePhone, formatPrice, slugify } from '@/lib/validation'

describe('Validation utilities', () => {
  describe('validatePhone', () => {
    it('should validate Kenya phone numbers', () => {
      expect(validatePhone('+254700123456')).toBe(true)
      expect(validatePhone('254700123456')).toBe(true)
      expect(validatePhone('0700123456')).toBe(false)
      expect(validatePhone('+1234567890')).toBe(false)
    })
  })

  describe('formatPrice', () => {
    it('should format price in KES', () => {
      expect(formatPrice(1000)).toBe('KSh 1,000')
      expect(formatPrice(150000)).toBe('KSh 150,000')
      expect(formatPrice(0)).toBe('KSh 0')
    })
  })

  describe('slugify', () => {
    it('should create URL-safe slugs', () => {
      expect(slugify('iPhone 15 Pro Max')).toBe('iphone-15-pro-max')
      expect(slugify('  Mac Book Pro  ')).toBe('mac-book-pro')
      expect(slugify('Samsung Galaxy S24')).toBe('samsung-galaxy-s24')
    })
  })
})
