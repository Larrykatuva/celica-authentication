import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../../shared/decorators/roles.decorators';
import { UserRole } from '../../user/interfaces/role.interface';
import { Request } from 'express';
import { RoleService } from '../../user/services/role.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector, private roleService: RoleService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiredRoles.length == 0) {
      return true;
    }
    const { user } = request;
    const userRoles = await this.roleService.filterUserRoles({
      user: { id: user['sub'] },
      isActive: true,
    });
    const setRoles = userRoles.map((role) => role.role);
    return requiredRoles.some((role) => setRoles?.includes(role));
  }
}
