import { handleError, AppError, Errors } from '@/lib/errors'

describe('Error handling', () => {
  describe('AppError', () => {
    it('should create an error with status code', () => {
      const error = new AppError('Not found', 404, 'NOT_FOUND')
      expect(error.message).toBe('Not found')
      expect(error.statusCode).toBe(404)
      expect(error.code).toBe('NOT_FOUND')
    })
  })

  describe('Errors factory', () => {
    it('should create NotFound error', () => {
      const error = Errors.NotFound('User')
      expect(error.message).toBe('User not found')
      expect(error.statusCode).toBe(404)
    })

    it('should create Unauthorized error', () => {
      const error = Errors.Unauthorized()
      expect(error.message).toBe('Unauthorized')
      expect(error.statusCode).toBe(401)
    })

    it('should create Forbidden error', () => {
      const error = Errors.Forbidden()
      expect(error.message).toBe('Forbidden')
      expect(error.statusCode).toBe(403)
    })
  })

  describe('handleError', () => {
    it('should handle AppError', () => {
      const error = new AppError('Test', 400, 'TEST')
      const result = handleError(error)
      expect(result.status).toBe(400)
      expect(result.error).toBe('Test')
    })

    it('should handle generic Error', () => {
      const error = new Error('Something broke')
      const result = handleError(error)
      expect(result.status).toBe(500)
      expect(result.error).toBe('Internal server error')
    })
  })
})
