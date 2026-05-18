import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
  jwtSecret: string;
  jwtExpiresIn: string;
}

const getConfig = (): Config => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const nodeEnv = process.env.NODE_ENV || 'development';
  const databaseUrl = process.env.DATABASE_URL || '';
  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_for_development_only';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!databaseUrl && nodeEnv === 'production') {
    throw new Error('DATABASE_URL environment variable is missing.');
  }

  if (jwtSecret === 'fallback_secret_for_development_only' && nodeEnv === 'production') {
    throw new Error('JWT_SECRET environment variable is missing or insecure in production.');
  }

  return {
    port,
    nodeEnv,
    databaseUrl,
    jwtSecret,
    jwtExpiresIn,
  };
};

export const config = getConfig();
