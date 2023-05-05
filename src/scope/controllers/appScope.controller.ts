import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AppScopeService } from '../services/appScope.service';
import {
  RequestPaginationDecorator,
  SharedResponse,
} from '../../shared/decorators/response.decorators';
import {
  AppScopeResDto,
  CreateAppScopeDto,
  UpdateAppScopeDto,
} from '../dtos/appScope.dto';
import { AppScope } from '../entities/appScope.entity';
import { AuthRoles } from '../../shared/decorators/roles.decorators';
import { UserRole } from '../../user/interfaces/role.interface';
import { ExtractRequestUser } from '../../shared/decorators/user.decorators';
import { ScopeService } from '../services/scope.service';
import { UserService } from '../../user/services/user.service';
import { AppService } from '../../application/services/app.service';
import { ExtractPagination } from '../../shared/decorators/pagination.decorator';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { SharedQueryExtractor } from '../../shared/decorators/query.decorator';
import { LoggedUser } from '../../auth/interfaces/user.interface';

@ApiTags('Scope')
@AuthRoles(UserRole.SUPER_ADMIN)
@Controller('app-scope')
export class AppScopeController {
  constructor(
    private appScopeService: AppScopeService,
    private scopeService: ScopeService,
    private userService: UserService,
    private appService: AppService,
  ) {}

  @Post()
  @SharedResponse(AppScopeResDto)
  async linkAppScope(
    @Body() body: CreateAppScopeDto,
    @ExtractRequestUser() loggedUser: LoggedUser,
  ): Promise<AppScope> {
    const app = await this.appService.filterApp({ id: body.app });
    const scope = await this.scopeService.filterScope({ id: body.scope });
    const user = await this.userService.filterUser({ id: loggedUser.sub });
    return await this.appScopeService.linkAppToScope(app, scope, user);
  }

  @Get()
  @RequestPaginationDecorator(AppScopeResDto)
  async getLinkedAppScopes(
    @ExtractPagination() pagination: DefaultPagination,
    @SharedQueryExtractor() query: any,
  ): Promise<[AppScope[], number]> {
    return await this.appScopeService.filterAppScopes(pagination, query, {
      relations: ['app', 'scope', 'actionBy'],
    });
  }

  @Get(':id')
  @SharedResponse(AppScopeResDto, 200)
  async getLinkedAppScope(@Param('id') id: string): Promise<AppScope> {
    return await this.appScopeService.filterAppScope({ id: id });
  }

  @Patch(':id')
  @SharedResponse(AppScopeResDto, 200)
  async updateLinkedAppScope(
    @Param('id') id: string,
    @ExtractRequestUser() loggedUser: LoggedUser,
    @Body() body: CreateAppScopeDto,
  ): Promise<AppScope> {
    const user = await this.userService.filterUser({ id: loggedUser.sub });
    return await this.appScopeService.updateAppScopeConfiguration(
      { id: id },
      user,
      body,
    );
  }

  @Delete(':id')
  @SharedResponse(undefined, 204)
  async deleteLinkedScope(@Param('id') id: string): Promise<void> {
    await this.appScopeService.deleteAppScopeConfiguration({ id: id });
  }
}
