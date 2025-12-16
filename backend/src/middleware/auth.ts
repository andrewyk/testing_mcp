import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { ApiError } from './errorHandler'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    username: string
  }
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      throw new ApiError(401, 'No token provided')
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string
      email: string
      username: string
    }

    req.user = decoded
    next()
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token'))
  }
}

module.exports = { authenticate }
