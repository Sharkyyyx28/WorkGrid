import { User, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

// Optimized select to avoid pulling sensitive password hashes
const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  organizationId: true,
  createdAt: true,
  updatedAt: true,
};

export class UserRepository {
  public async create(data: Prisma.UserCreateInput): Promise<any> {
    return prisma.user.create({ data, select: userSelect });
  }

  public async findById(id: string, organizationId?: string): Promise<any | null> {
    return prisma.user.findFirst({
      where: {
        id,
        ...(organizationId && { organizationId }),
      },
      select: userSelect,
    });
  }

  public async findByEmail(email: string, organizationId?: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email,
        ...(organizationId && { organizationId }),
      },
    });
  }

  public async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: any;
  }): Promise<any[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: userSelect,
    });
  }

  public async count(where?: Prisma.UserWhereInput): Promise<number> {
    return prisma.user.count({ where });
  }

  public async update(
    id: string,
    data: Prisma.UserUpdateInput,
    organizationId?: string
  ): Promise<any> {
    // If organizationId is provided, verify existence within tenant before updating
    if (organizationId) {
      const user = await this.findById(id, organizationId);
      if (!user) {
        throw new Error('User not found or does not belong to this tenant');
      }
    }
    return prisma.user.update({ where: { id }, data, select: userSelect });
  }

  public async delete(id: string, organizationId?: string): Promise<any> {
    if (organizationId) {
      const user = await this.findById(id, organizationId);
      if (!user) {
        throw new Error('User not found or does not belong to this tenant');
      }
    }
    return prisma.user.delete({ where: { id }, select: userSelect });
  }
}

export const userRepository = new UserRepository();
