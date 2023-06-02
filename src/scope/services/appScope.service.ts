import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppScope } from '../entities/appScope.entity';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { App } from '../../application/entities/app.entity';
import { Scope } from '../entities/scope.entity';
import { User } from '../../user/entities/user.entity';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';
import { UpdateAppScopeDto } from '../dtos/appScope.dto';
import { ScopeService } from './scope.service';
import { UserService } from '../../user/services/user.service';
import { AppService } from '../../application/services/app.service';

@Injectable()
export class AppScopeService {
  constructor(
    @InjectRepository(AppScope)
    private appScopeRepository: Repository<AppScope>,
    private scopeService: ScopeService,
    private appService: AppService,
  ) {}

  /**
   * Filter App linked to scope configurations.
   * @param filterOptions
   * @param options
   */
  async filterAppScope(
    filterOptions: FindOptionsWhere<AppScope>,
    options?: FindOneOptions<AppScope>,
  ): Promise<AppScope> {
    try {
      return await this.appScopeRepository.findOne({
        where: filterOptions,
        ...options,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAppScopes(
    filterOptions: FindOptionsWhere<AppScope>,
  ): Promise<string[]> {
    const appScopes = await this.appScopeRepository.find({
      where: filterOptions,
      relations: ['scope'],
    });
    const result: string[] = [];
    for (let i = 0; i < appScopes.length; i++) {
      result.push(appScopes[i].scope.name);
    }
    return result;
  }

  /**
   * Link an app to scope.
   * @param app
   * @param scope
   * @param user
   */
  async linkAppToScope(app: App, scope: Scope, user: User): Promise<AppScope> {
    if (!scope.isActive) throw new BadRequestException('Scope is deactivated.');
    if (
      await this.filterAppScope({
        app: { id: app.id },
        scope: { id: scope.id },
      })
    )
      throw new BadRequestException('App already linked to scope.');
    return await this.appScopeRepository.save({
      app: app,
      scope: scope,
      actionBy: user,
    });
  }

  /**
   * Update app-scope linking configuration.
   * @param filterOptions
   * @param user
   * @param updateData
   */
  async updateAppScopeConfiguration(
    filterOptions: FindOptionsWhere<AppScope>,
    user: User,
    updateData: UpdateAppScopeDto,
  ): Promise<AppScope> {
    if (!(await this.filterAppScope(filterOptions)))
      throw new BadRequestException('Configuration not found');
    const updateRecord = new AppScope();
    updateRecord.actionBy = user;
    if (updateData.scope)
      updateRecord.scope = await this.scopeService.filterScope({
        id: updateData.scope,
      });
    if (updateData.app)
      updateRecord.app = await this.appService.filterApp({
        id: updateData.app,
      });
    if (
      await this.filterAppScope({
        app: { id: updateData.app },
        scope: { id: updateData.scope },
      })
    )
      throw new BadRequestException('App already linked to scope.');
    await this.appScopeRepository.update(filterOptions, updateRecord);
    return await this.filterAppScope(filterOptions, {
      relations: ['app', 'scope', 'actionBy'],
    });
  }

  /**
   * Filter a paginated list of app-scope configurations.
   * @param pagination
   * @param filterOptions
   * @param options
   */
  async filterAppScopes(
    pagination: DefaultPagination,
    filterOptions?: FindOptionsWhere<AppScope>,
    options?: FindOneOptions<AppScope>,
  ): Promise<[AppScope[], number]> {
    try {
      return await this.appScopeRepository.findAndCount({
        where: filterOptions,
        ...pagination,
        ...options,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteAppScopeConfiguration(filterOptions: any): Promise<void> {
    if (!(await this.filterAppScope(filterOptions)))
      throw new BadRequestException('Configuration not found');
    await this.appScopeRepository.delete(filterOptions);
  }
}
