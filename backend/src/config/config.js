import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRE || '7d',
};

// Validate required environment variables in production
if (config.nodeEnv === 'production' && !config.jwtSecret) {
  throw new Error('JWT_SECRET must be defined in production environment');
}

// Use a default for development only
if (!config.jwtSecret) {
  console.warn('⚠️  Warning: Using default JWT_SECRET. This is only acceptable in development!');
  config.jwtSecret = 'dev-secret-key-change-in-production';
}

export default config;
