import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { userRepository, UserRepository } from '../repositories/user.repository';
import {
  organizationRepository,
  OrganizationRepository,
} from '../repositories/organization.repository';
import { AppError } from '../utils/AppError';
import { JwtToken } from '../utils/jwt';
import { AuthResponse } from '../types/auth.types';

export class AuthService {
  private userRepo: UserRepository;
  private orgRepo: OrganizationRepository;

  constructor(
    userRepo: UserRepository = userRepository,
    orgRepo: OrganizationRepository = organizationRepository
  ) {
    this.userRepo = userRepo;
    this.orgRepo = orgRepo;
  }

  public async register(data: any): Promise<AuthResponse> {
    const { organizationName, name, email, password } = data;

    // Check if user already exists
    const existingUser = await this.userRepo.findByEmail(email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create organization and owner user in transaction
    const { organization, user } = await this.orgRepo.createWithOwner(
      { name: organizationName },
      {
        name,
        email,
        password: hashedPassword,
        role: Role.OWNER,
      }
    );

    // Generate JWT token
    const token = JwtToken.generate({
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: organization.id,
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      organization: {
        id: organization.id,
        name: organization.name,
      },
    };
  }

  public async login(data: any): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user by email
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = JwtToken.generate({
      id: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId,
    });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}

export const authService = new AuthService();
