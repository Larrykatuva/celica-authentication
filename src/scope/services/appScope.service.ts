import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppScope } from '../entities/appScope.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { App } from '../../application/entities/app.entity';
import { Scope } from '../entities/scope.entity';
import { User } from '../../user/entities/user.entity';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';

@Injectable()
export class AppScopeService {
  constructor(
    @InjectRepository(AppScope)
    private appScopeRepository: Repository<AppScope>,
  ) {}

  /**
   * Filter App linked to scope configurations.
   * @param filterOptions
   * @param options
   */
  async filterAppScope(
    filterOptions: any,
    options?: FindOneOptions<AppScope>,
  ): Promise<AppScope> {
    try {
      return await this.appScopeRepository.findOne({
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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
      user: user,
    });
  }

  /**
   * Update app-scope linking configuration.
   * @param filterOptions
   * @param user
   * @param updateData
   */
  async updateAppScopeConfiguration(
    filterOptions: any,
    user: User,
    updateData: Partial<AppScope>,
  ): Promise<AppScope> {
    if (!updateData.scope?.isActive)
      throw new BadRequestException('Scope is deactivated.');
    if (!(await this.filterAppScope(filterOptions)))
      throw new BadRequestException('Configuration not found');
    await this.appScopeRepository.update(
      { ...filterOptions },
      { actionBy: user, ...updateData },
    );
    return await this.filterAppScope(filterOptions);
  }

  /**
   * Filter a paginated list of app-scope configurations.
   * @param pagination
   * @param filterOptions
   * @param options
   */
  async filterAppScopes(
    pagination: DefaultPagination,
    filterOptions?: any,
    options?: FindOneOptions<AppScope>,
  ): Promise<[AppScope[], number]> {
    try {
      return await this.appScopeRepository.findAndCount({
        where: { ...filterOptions },
        ...pagination,
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteAppScopeConfiguration(filterOptions: any): Promise<void> {
    if (!(await this.filterAppScope(filterOptions)))
      throw new BadRequestException('Configuration not found');
    await this.appScopeRepository.delete({ ...filterOptions });
  }
}
