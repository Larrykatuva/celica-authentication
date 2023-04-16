import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ScopeService } from '../services/scope.service';
import { ConfigureScopeDto } from '../dtos/scope.dto';
import { Scope } from '../entities/scope.entity';
import { ExtractPagination } from '../../shared/decorators/pagination.decorator';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';

@ApiTags('Scope')
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
}
