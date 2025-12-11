import { Request, Response, NextFunction } from 'express'

// TODO: Implement proper rate limiting for production
// This is a placeholder that should be replaced with express-rate-limit
// or a similar library before deployment

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export const rateLimiter = (
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  max: number = 100 // limit each IP to 100 requests per windowMs
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Replace with proper rate limiting library like express-rate-limit
    // This is a basic implementation for development only
    
    const ip = req.ip || req.socket.remoteAddress || 'unknown'
    const now = Date.now()
    
    if (!store[ip] || store[ip].resetTime < now) {
      store[ip] = {
        count: 1,
        resetTime: now + windowMs,
      }
      return next()
    }
    
    if (store[ip].count >= max) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later.',
      })
    }
    
    store[ip].count++
    next()
  }
}

module.exports = { rateLimiter }
