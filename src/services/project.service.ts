import { Prisma, Project } from '@prisma/client';
import { projectRepository, ProjectRepository } from '../repositories/project.repository';
import { AppError } from '../utils/AppError';
import { PaginatedResponse } from '../types';

export class ProjectService {
  private repo: ProjectRepository;

  constructor(repo: ProjectRepository = projectRepository) {
    this.repo = repo;
  }

  public async createProject(data: Prisma.ProjectUncheckedCreateInput): Promise<Partial<Project>> {
    return this.repo.create(data);
  }

  public async getProjectById(id: string, organizationId: string): Promise<Partial<Project>> {
    const project = await this.repo.findById(id, organizationId);
    if (!project) {
      throw new AppError('Project not found or access denied', 404);
    }
    return project;
  }

  public async getProjects(
    organizationId: string,
    query: {
      page?: number;
      limit?: number;
      status?: any;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<PaginatedResponse<Partial<Project>>> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    // Build tenant-isolated and filtered where clause
    const where: Prisma.ProjectWhereInput = {
      organizationId,
      ...(query.status && { status: query.status }),
      ...(query.search && {
        name: {
          contains: query.search,
          mode: 'insensitive',
        },
      }),
    };

    // Build dynamic sorting
    const orderBy: Prisma.ProjectOrderByWithRelationInput = {
      [query.sortBy || 'createdAt']: query.sortOrder || 'desc',
    };

    const [projects, total] = await Promise.all([
      this.repo.findAll({ skip, take: limit, where, orderBy }),
      this.repo.count(where),
    ]);

    return {
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async updateProject(
    id: string,
    organizationId: string,
    data: Prisma.ProjectUncheckedUpdateInput
  ): Promise<Partial<Project>> {
    // Verify existence and tenant ownership before updating
    await this.getProjectById(id, organizationId);
    return this.repo.update(id, data);
  }

  public async deleteProject(id: string, organizationId: string): Promise<Partial<Project>> {
    // Verify existence and tenant ownership before deleting
    await this.getProjectById(id, organizationId);
    return this.repo.delete(id);
  }
}

export const projectService = new ProjectService();
