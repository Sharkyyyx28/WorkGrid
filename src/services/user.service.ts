import { User, Prisma } from '@prisma/client';
import { userRepository, UserRepository } from '../repositories/user.repository';
import { AppError } from '../utils/AppError';
import { PaginatedResponse } from '../types';

export class UserService {
  private repo: UserRepository;

  constructor(repo: UserRepository = userRepository) {
    this.repo = repo;
  }

  public async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const existingUser = await this.repo.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }
    return this.repo.create(data);
  }

  public async getUserById(id: string): Promise<User> {
    const user = await this.repo.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  public async getUsers(page = 1, limit = 10): Promise<PaginatedResponse<User>> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.repo.findAll({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.repo.count(),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  public async updateUser(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    await this.getUserById(id); // verify existence
    return this.repo.update(id, data);
  }

  public async deleteUser(id: string): Promise<User> {
    await this.getUserById(id); // verify existence
    return this.repo.delete(id);
  }
}

export const userService = new UserService();
