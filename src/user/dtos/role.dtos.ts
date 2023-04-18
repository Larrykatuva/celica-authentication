import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from '@nestjs/class-validator';
import { UserRole } from '../interfaces/role.interface';
import { UserResponseDto } from '../../auth/dtos/user.dto';

export class AssignRoleDto {
  @ApiProperty({ enum: UserRole })
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty()
  @IsNotEmpty()
  user: string;
}

export class UpdateRoleDto {
  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty()
  user: string;

  @ApiProperty()
  isActive: boolean;
}

export class RoleResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  user: UserResponseDto;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  assignedBy: UserResponseDto;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
