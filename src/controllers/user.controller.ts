import { Response } from 'express';
import { userService, UserService } from '../services/user.service';
import { asyncHandler } from '../utils/asyncHandler';
import { CustomRequest } from '../types';
import { TenantHelper } from '../utils/tenantHelper';

export class UserController {
  private service: UserService;

  constructor(service: UserService = userService) {
    this.service = service;
  }

  public createUser = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    // Automatically inject tenant context into create payload
    const tenantScopedData = TenantHelper.withTenantCreate(req, req.body);
    const user = await this.service.createUser(tenantScopedData);
    res.status(201).json({
      success: true,
      data: user,
    });
  });

  public getUsers = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const organizationId = req.tenant!.organizationId;

    const result = await this.service.getUsers(req.query, organizationId);
    res.status(200).json({
      success: true,
      ...result,
    });
  });

  public getUserById = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const organizationId = req.tenant!.organizationId;
    const user = await this.service.getUserById(req.params.id, organizationId);
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  public updateUser = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const organizationId = req.tenant!.organizationId;
    const user = await this.service.updateUser(req.params.id, req.body, organizationId);
    res.status(200).json({
      success: true,
      data: user,
    });
  });

  public deleteUser = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const organizationId = req.tenant!.organizationId;
    await this.service.deleteUser(req.params.id, organizationId);
    res.status(200).json({
      success: true,
      message: 'User successfully deleted',
    });
  });
}

export const userController = new UserController();
