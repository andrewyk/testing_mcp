import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { ApiError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = registerSchema.parse(req.body)

    // TODO: Check if user already exists
    // TODO: Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    // TODO: Save user to database
    const user = {
      id: 'temp-id',
      email: validatedData.email,
      username: validatedData.username,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, error.errors[0].message))
    } else {
      next(error)
    }
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData = loginSchema.parse(req.body)

    // TODO: Find user in database by email
    // const user = await findUserByEmail(validatedData.email)
    // if (!user) {
    //   throw new ApiError(401, 'Invalid credentials')
    // }

    // TODO: Verify password against stored hash
    // const isValid = await bcrypt.compare(validatedData.password, user.password_hash)
    // if (!isValid) {
    //   throw new ApiError(401, 'Invalid credentials')
    // }

    // Temporary mock implementation - replace with database queries
    const user = {
      id: 'temp-id',
      email: validatedData.email,
      username: 'temp-username',
    }

    const token = jwt.sign(
      user,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      data: {
        user,
        token,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ApiError(400, error.errors[0].message))
    } else {
      next(error)
    }
  }
}

export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Fetch full user profile from database
    const user = {
      id: req.user?.id,
      email: req.user?.email,
      username: req.user?.username,
    }

    res.json({
      success: true,
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, getProfile }
