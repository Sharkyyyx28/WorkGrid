import { Request, Response } from 'express';
import { authService, AuthService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';

export class AuthController {
  private service: AuthService;

  constructor(service: AuthService = authService) {
    this.service = service;
  }

  public register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.register(req.body);
    res.status(201).json(result);
  });

  public login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await this.service.login(req.body);
    res.status(200).json(result);
  });
}

export const authController = new AuthController();
