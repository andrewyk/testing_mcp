import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details || err.message,
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({
      error: 'Resource already exists',
      details: 'A resource with that value already exists',
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      error: 'Invalid reference',
      details: 'Referenced resource does not exist',
    });
  }

  return res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
};
