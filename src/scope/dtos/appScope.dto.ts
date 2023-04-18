import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from '@nestjs/class-validator';
import { AppResponseDto } from '../../application/dto/app.dtos';
import { ScopeResDto } from './scope.dto';
import { UserResponseDto } from '../../auth/dtos/user.dto';

export class CreatAppScopeDto {
  @ApiProperty()
  @IsNotEmpty()
  app: string;

  @ApiProperty()
  @IsNotEmpty()
  scope: string;
}

export class UpdateAppScopeDto {
  @ApiProperty()
  app: string;

  @ApiProperty()
  scope: string;
}

export class AppScopeResDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  app: AppResponseDto;

  @ApiProperty()
  scope: ScopeResDto;

  @ApiProperty()
  actionBy: UserResponseDto;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  updatedAt: string;
}
