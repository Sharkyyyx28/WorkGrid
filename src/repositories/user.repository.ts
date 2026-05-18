import { User, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export class UserRepository {
  public async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  public async findById(id: string, organizationId?: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        id,
        ...(organizationId && { organizationId }),
      },
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
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, where, orderBy } = params;
    return prisma.user.findMany({ skip, take, where, orderBy });
  }

  public async count(where?: Prisma.UserWhereInput): Promise<number> {
    return prisma.user.count({ where });
  }

  public async update(
    id: string,
    data: Prisma.UserUpdateInput,
    organizationId?: string
  ): Promise<User> {
    // If organizationId is provided, verify existence within tenant before updating
    if (organizationId) {
      const user = await this.findById(id, organizationId);
      if (!user) {
        throw new Error('User not found or does not belong to this tenant');
      }
    }
    return prisma.user.update({ where: { id }, data });
  }

  public async delete(id: string, organizationId?: string): Promise<User> {
    if (organizationId) {
      const user = await this.findById(id, organizationId);
      if (!user) {
        throw new Error('User not found or does not belong to this tenant');
      }
    }
    return prisma.user.delete({ where: { id } });
  }
}

export const userRepository = new UserRepository();
