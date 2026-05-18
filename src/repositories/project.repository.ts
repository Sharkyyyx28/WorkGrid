import { Prisma, Project } from '@prisma/client';
import { prisma } from '../config/prisma';

// Optimized select to avoid pulling unnecessary heavy relations
const projectSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  organizationId: true,
  createdBy: true,
  createdAt: true,
  updatedAt: true,
};

export class ProjectRepository {
  public async create(data: Prisma.ProjectUncheckedCreateInput): Promise<Partial<Project>> {
    return prisma.project.create({
      data,
      select: projectSelect,
    });
  }

  public async findById(id: string, organizationId: string): Promise<Partial<Project> | null> {
    return prisma.project.findFirst({
      where: {
        id,
        organizationId,
      },
      select: projectSelect,
    });
  }

  public async findAll(params: {
    skip?: number;
    take?: number;
    where: Prisma.ProjectWhereInput;
    orderBy?: Prisma.ProjectOrderByWithRelationInput;
  }): Promise<Partial<Project>[]> {
    const { skip, take, where, orderBy } = params;
    return prisma.project.findMany({
      skip,
      take,
      where,
      orderBy,
      select: projectSelect,
    });
  }

  public async count(where: Prisma.ProjectWhereInput): Promise<number> {
    return prisma.project.count({ where });
  }

  public async update(id: string, data: Prisma.ProjectUncheckedUpdateInput): Promise<Partial<Project>> {
    return prisma.project.update({
      where: { id },
      data,
      select: projectSelect,
    });
  }

  public async delete(id: string): Promise<Partial<Project>> {
    return prisma.project.delete({
      where: { id },
      select: projectSelect,
    });
  }
}

export const projectRepository = new ProjectRepository();
