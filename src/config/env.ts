import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl: string;
}

const getConfig = (): Config => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const nodeEnv = process.env.NODE_ENV || 'development';
  const databaseUrl = process.env.DATABASE_URL || '';

  if (!databaseUrl && nodeEnv === 'production') {
    throw new Error('DATABASE_URL environment variable is missing.');
  }

  return {
    port,
    nodeEnv,
    databaseUrl,
  };
};

export const config = getConfig();
