import { Organization, Prisma, User } from '@prisma/client';
import { prisma } from '../config/prisma';

export class OrganizationRepository {
  public async createWithOwner(
    orgData: Prisma.OrganizationCreateWithoutUsersInput,
    userData: Prisma.UserCreateWithoutOrganizationInput
  ): Promise<{ organization: Organization; user: User }> {
    const organization = await prisma.organization.create({
      data: {
        ...orgData,
        users: {
          create: userData,
        },
      },
      include: {
        users: true,
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
