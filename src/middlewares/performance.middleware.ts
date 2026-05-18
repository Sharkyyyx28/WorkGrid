import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env';

/**
 * Performance Logging Middleware
 * Measures and logs the exact execution time of HTTP requests to identify bottlenecks.
 */
export const performanceLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    // Log performance metrics
    if (config.nodeEnv === 'development' || durationMs > 500) {
      console.log(
        `[Performance] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${durationMs.toFixed(2)} ms`
      );
    }
  });

  next();
};
