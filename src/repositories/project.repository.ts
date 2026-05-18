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

  /**
   * Fetches Project -> Tasks -> Assigned User with extreme efficiency.
   *
   * --- EXPLANATION OF WHY THIS AVOIDS N+1 PROBLEMS & HOW PRISMA WORKS ---
   * 1. Naive ORM implementations suffer from the N+1 problem: 1 query to fetch the Project,
   *    1 query for its Tasks, and N queries (e.g., 1000+ queries) to fetch the User for each Task.
   * 2. Prisma Query Engine solves this by utilizing batched `WHERE IN (...)` queries under the hood.
   *    Instead of executing 1000+ queries, Prisma executes exactly 3 highly optimized SQL queries:
   *      - Query 1: SELECT ... FROM projects WHERE id = $1 AND organizationId = $2
   *      - Query 2: SELECT ... FROM tasks WHERE projectId IN ($1)
   *      - Query 3: SELECT ... FROM users WHERE id IN (unique_assignedTo_ids_from_tasks)
   * 3. Prisma's Rust-based query engine then stitches the in-memory graph together instantly.
   * 4. By combining explicit `select` payloads, we ensure no heavy password hashes or unneeded columns
   *    are transmitted across the wire, allowing this endpoint to scale effortlessly for 1000+ tasks.
   */
  public async findFullDataById(id: string, organizationId: string): Promise<any | null> {
    return prisma.project.findFirst({
      where: {
        id,
        organizationId, // Enforces strict tenant isolation at the root level
      },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        tasks: {
          select: {
            id: true,
            title: true,
            priority: true,
            status: true,
            dueDate: true,
            assignee: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: {
            dueDate: 'asc', // Presort tasks by due date for optimal UI rendering
          },
        },
      },
    });
  }

  public async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProjectWhereUniqueInput;
    where: Prisma.ProjectWhereInput;
    orderBy?: any;
  }): Promise<Partial<Project>[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return prisma.project.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: projectSelect,
    });
  }

  public async count(where: Prisma.ProjectWhereInput): Promise<number> {
    return prisma.project.count({ where });
  }

  public async update(
    id: string,
    data: Prisma.ProjectUncheckedUpdateInput
  ): Promise<Partial<Project>> {
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
