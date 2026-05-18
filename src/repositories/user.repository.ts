import { User, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';

export class UserRepository {
  public async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  public async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
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

  public async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  public async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
}

export const userRepository = new UserRepository();
