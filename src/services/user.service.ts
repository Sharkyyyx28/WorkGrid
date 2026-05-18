import { User, Prisma } from '@prisma/client';
import { userRepository, UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';
import { PaginatedResponse } from '../types';
import { PaginationUtil } from '../utils/pagination';

export class UserService {
  private repo: UserRepository;

  constructor(repo: UserRepository = userRepository) {
    this.repo = repo;
  }

  public async createUser(data: Prisma.UserCreateInput): Promise<Partial<User>> {
    const existingUser = await this.repo.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }
    return this.repo.create(data);
  }

  public async getUserById(id: string, organizationId?: string): Promise<Partial<User>> {
    const user = await this.repo.findById(id, organizationId);
    if (!user) {
      throw new AppError('User not found or access denied', 404);
    }
    return user;
  }

  public async getUsers(
    query: any,
    organizationId?: string
  ): Promise<PaginatedResponse<Partial<User>>> {
    const where = organizationId ? { organizationId } : undefined;
    const prismaParams = PaginationUtil.getPrismaParams(query, 'createdAt');

    const [users, total] = await Promise.all([
      this.repo.findAll({ ...prismaParams, where }),
      this.repo.count(where),
    ]);

    return PaginationUtil.formatResponse(users, total, query);
  }

  public async updateUser(
    id: string,
    data: Prisma.UserUpdateInput,
    organizationId?: string
  ): Promise<Partial<User>> {
    await this.getUserById(id, organizationId); // verify existence within tenant
    return this.repo.update(id, data, organizationId);
  }

  public async deleteUser(id: string, organizationId?: string): Promise<Partial<User>> {
    await this.getUserById(id, organizationId); // verify existence within tenant
    return this.repo.delete(id, organizationId);
  }
}

export const userService = new UserService();
