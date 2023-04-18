import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { AuthRoles } from '../../shared/decorators/roles.decorators';
import { AssignRoleDto, UpdateRoleDto } from '../dtos/role.dtos';
import { Role } from '../entities/role.entity';
import { ExtractRequestUser } from '../../shared/decorators/user.decorators';
import { RequestUser } from '../interfaces/user.interface';

@ApiTags('User')
@AuthRoles()
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  async assignRole(
    @Body() body: AssignRoleDto,
    @ExtractRequestUser() user: RequestUser,
  ): Promise<Role> {
    return await this.roleService.assignRole(body, user.sub);
  }

  @Patch(':id')
  async updateUserRole(
    @Param('id') id: string,
    @Body() body: UpdateRoleDto,
    @ExtractRequestUser() user: RequestUser,
  ): Promise<Role> {
    return await this.roleService.updateUserRole({ id: id }, body, user.sub);
  }
}
