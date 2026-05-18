import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { JwtPayload } from '../types/auth.types';
import { AppError } from './AppError';

export class JwtToken {
  public static generate(payload: JwtPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });
  }

  public static verify(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.jwtSecret) as JwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token has expired. Please log in again.', 401);
      }
      throw new AppError('Invalid token. Please log in again.', 401);
    }
  }
}
