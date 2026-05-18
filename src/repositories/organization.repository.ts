import { Organization, Prisma, User } from '@prisma/client';
import { prisma } from '../config/prisma';

export class OrganizationRepository {
  public async createWithOwner(
    orgData: Prisma.OrganizationCreateWithoutUsersInput,
    userData: Prisma.UserCreateWithoutOrganizationInput
  ): Promise<{ organization: any; user: any }> {
    const organization = await prisma.organization.create({
      data: {
        ...orgData,
        users: {
          create: userData,
        },
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            organizationId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    const user = organization.users[0];
    return { organization, user };
  }

  public async findById(id: string): Promise<Organization | null> {
    return prisma.organization.findUnique({ where: { id } });
  }
}

export const organizationRepository = new OrganizationRepository();
