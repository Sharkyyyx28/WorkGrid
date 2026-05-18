import { Response } from 'express';
import { projectService, ProjectService } from '../services/project.service';
import { asyncHandler } from '../utils/asyncHandler';
import { CustomRequest } from '../types';
import { TenantHelper } from '../utils/tenantHelper';

export class ProjectController {
  private service: ProjectService;

  constructor(service: ProjectService = projectService) {
    this.service = service;
  }

  public createProject = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    // Automatically inject tenant context (organizationId) and creator userId
    const tenantScopedData = TenantHelper.withTenantCreate(req, {
      ...req.body,
      createdBy: req.tenant!.userId,
    });

    const project = await this.service.createProject(tenantScopedData);
    res.status(201).json({
      success: true,
      data: project,
    });
  });

  public getProjects = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const organizationId = req.tenant!.organizationId;
    const result = await this.service.getProjects(organizationId, req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  });

  public getProjectById = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const organizationId = req.tenant!.organizationId;
    const project = await this.service.getProjectById(req.params.id, organizationId);
    res.status(200).json({
      success: true,
      data: project,
    });
  });

  public updateProject = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const organizationId = req.tenant!.organizationId;
    const project = await this.service.updateProject(req.params.id, organizationId, req.body);
    res.status(200).json({
      success: true,
      data: project,
    });
  });

  public deleteProject = asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const organizationId = req.tenant!.organizationId;
    await this.service.deleteProject(req.params.id, organizationId);
    res.status(200).json({
      success: true,
      message: 'Project successfully deleted',
    });
  });
}

export const projectController = new ProjectController();
