import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from "typeorm";
import { UserService } from './user.service';
import { AssignRoleDto, UpdateRoleDto } from '../dtos/role.dtos';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
    private userService: UserService,
  ) {}

  /**
   * Filter user role.
   * @param filterOptions
   * @param options
   */
  async filterRole(
    filterOptions: any,
    options?: FindOneOptions<Role>,
  ): Promise<Role> {
    try {
      return await this.roleRepository.findOne({
        where: filterOptions,
        ...options,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Assign a role to a user.
   * @param role
   * @param assignedBy
   */
  async assignRole(role: AssignRoleDto, assignedBy: string): Promise<Role> {
    const user = await this.userService.filterUser({ id: role.user });
    if (!user) throw new BadRequestException('User not found');
    if (await this.filterRole({ role: role.role, user: { id: user.id } }))
      throw new BadRequestException('Role already assigned to this user');
    return await this.roleRepository.save({
      role: role.role,
      user: user,
      assignedBy: await this.userService.filterUser({ id: assignedBy }),
    });
  }

  /**
   * Update user role.
   * @param filterOptions
   * @param updateData
   * @param assignedBy
   */
  async updateUserRole(
    filterOptions: FindOptionsWhere<Role>,
    updateData: UpdateRoleDto,
    assignedBy: string,
  ): Promise<Role> {
    const role = new Role();
    if (updateData.isActive) role.isActive = updateData.isActive;
    if (updateData.role) role.role = updateData.role;
    role.assignedBy = await this.userService.filterUser({ id: assignedBy });
    if (!(await this.filterRole(filterOptions)))
      throw new BadRequestException('User not found');
    await this.roleRepository.update(filterOptions, role);
    return await this.filterRole(filterOptions);
  }

  /**
   * Filter user roles.
   * @param filterOptions
   * @param options
   */
  async filterUserRoles(
    filterOptions: any,
    options?: Partial<Role>,
  ): Promise<Role[]> {
    try {
      return await this.roleRepository.find({
        where: filterOptions,
        ...options,
      });
    } catch (error) {
      throw error;
    }
  }
}
