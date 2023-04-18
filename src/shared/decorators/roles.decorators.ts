import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserRole } from "../../user/interfaces/role.interface";

/**
 * Decorator to allow specifying what roles are required to access specific resources.
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

/**
 * Universal decorator which combines roles decorator and auth guard decorator.
 * @param roles
 * @constructor
 */
export const AuthRoles = (...roles: UserRole[]) => {
  return applyDecorators(Roles(...roles), UseGuards(AuthGuard, RolesGuard));
};
