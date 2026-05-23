export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export function handleError(error: unknown) {
  if (error instanceof AppError) {
    return { error: error.message, code: error.code, status: error.statusCode }
  }

  if (error instanceof Error) {
    console.error('Unhandled error:', error.message)
    return { error: 'Internal server error', status: 500 }
  }

  console.error('Unknown error:', error)
  return { error: 'Internal server error', status: 500 }
}

export const Errors = {
  NotFound: (resource: string) => new AppError(`${resource} not found`, 404, 'NOT_FOUND'),
  Unauthorized: () => new AppError('Unauthorized', 401, 'UNAUTHORIZED'),
  Forbidden: () => new AppError('Forbidden', 403, 'FORBIDDEN'),
  BadRequest: (message: string) => new AppError(message, 400, 'BAD_REQUEST'),
  Conflict: (message: string) => new AppError(message, 409, 'CONFLICT'),
  TooManyRequests: () => new AppError('Too many requests', 429, 'TOO_MANY_REQUESTS'),
}
