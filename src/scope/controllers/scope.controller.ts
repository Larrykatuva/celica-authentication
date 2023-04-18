import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScopeService } from '../services/scope.service';
import { ConfigureScopeDto, UpdateScopeDto } from '../dtos/scope.dto';
import { Scope } from '../entities/scope.entity';
import { ExtractPagination } from '../../shared/decorators/pagination.decorator';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { AuthRoles } from '../../shared/decorators/roles.decorators';
import { UserRole } from '../../user/interfaces/role.interface';

@ApiTags('Scope')
@AuthRoles(UserRole.SUPER_ADMIN)
@Controller('scope')
export class ScopeController {
  constructor(private scopeService: ScopeService) {}

  @Post()
  async addScope(@Body() scope: ConfigureScopeDto): Promise<Scope> {
    return await this.scopeService.configureNewScope(scope);
  }

  @Get()
  async getAllScopes(
    @ExtractPagination() pagination: DefaultPagination,
  ): Promise<[Scope[], number]> {
    return await this.scopeService.filterScopes(pagination);
  }

  @Get(':id')
  async getScope(@Param('id') id: string): Promise<Scope> {
    const scope = await this.scopeService.filterScope({ id: id });
    if (!scope) throw new BadRequestException('Scope not found');
    return scope;
  }

  @Patch(':id')
  async updateScope(
    @Param('id') id: string,
    @Body() updateData: UpdateScopeDto,
  ): Promise<Scope> {
    return await this.scopeService.updateScope({ id: id }, updateData);
  }
}
