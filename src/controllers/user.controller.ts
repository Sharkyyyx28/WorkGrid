import { Request, Response } from 'express';
import { userService, UserService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';

export class UserController {
  private service: UserService;

  constructor(service: UserService = userService) {
    this.service = service;
  }

  public createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.service.createUser(req.body);
    res.status(201).json({
      success: true,
      data: user,
    });
  });

  public getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

    const result = await this.service.getUsers(page, limit);
    res.status(200).json({
      success: true,
      ...result,
    });
  });

  public getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.service.getUserById(req.params.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  public updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const user = await this.service.updateUser(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  public deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    await this.service.deleteUser(req.params.id);
    res.status(200).json({
      success: true,
      message: 'User successfully deleted',
    });
  });
}

export const userController = new UserController();
