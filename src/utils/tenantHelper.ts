import { CustomRequest } from '../types';
import { AppError } from './AppError';

export class TenantHelper {
  /**
   * Enforces tenant scoping on Prisma WHERE clauses.
   * Example: prisma.project.findMany({ where: TenantHelper.withTenant(req, { status: 'ACTIVE' }) })
   */
  public static withTenant(req: CustomRequest, whereClause: any = {}): any {
    if (!req.tenant || !req.tenant.organizationId) {
      throw new AppError('Tenant context is missing from request.', 500);
    }

    return {
      ...whereClause,
      organizationId: req.tenant.organizationId,
    };
  }

  /**
   * Enforces tenant scoping on Prisma CREATE data payloads.
   * Automatically injects the correct organizationId from the authenticated tenant context.
   */
  public static withTenantCreate(req: CustomRequest, data: any = {}): any {
    if (!req.tenant || !req.tenant.organizationId) {
      throw new AppError('Tenant context is missing from request.', 500);
    }

    // Forcefully overwrite organizationId to prevent cross-tenant injection
    return {
      ...data,
      organizationId: req.tenant.organizationId,
    };
  }

  /**
   * Verifies that a target organization ID matches the current tenant context.
   * Throws 403 Forbidden if cross-tenant access is attempted.
   */
  public static assertTenantMatch(req: CustomRequest, targetOrgId?: string): void {
    if (!req.tenant || !req.tenant.organizationId) {
      throw new AppError('Tenant context is missing from request.', 500);
    }

    if (targetOrgId && targetOrgId !== req.tenant.organizationId) {
      throw new AppError('Cross-tenant access is strictly prohibited.', 403);
    }
  }
}
