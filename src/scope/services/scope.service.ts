import { InjectRepository } from '@nestjs/typeorm';
import { Scope } from '../entities/scope.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';

@Injectable()
export class ScopeService {
  constructor(
    @InjectRepository(Scope) private scopeRepository: Repository<Scope>,
  ) {}

  /**
   * Filter scope by filter options.
   * @param filterOptions
   */
  async filterScope(filterOptions: Partial<Scope>): Promise<Scope> {
    try {
      return await this.scopeRepository.findOne({
        where: { ...filterOptions },
      });
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  /**
   * Configure new scope that defines capabilities that an app access
   * token is capable of doing.
   * @param scope
   */
  async configureNewScope(scope: {
    name: string;
    description: string;
  }): Promise<Scope> {
    if (await this.filterScope({ name: scope.name }))
      throw new BadRequestException('Scope name is already configured.');
    return await this.scopeRepository.save(scope);
  }

  /**
   * Get a paginated list of scopes.
   * @param pagination
   * @param filterOptions
   * @param options
   */
  async filterScopes(
    pagination: DefaultPagination,
    filterOptions?: Partial<Scope>,
    options?: FindOneOptions<Scope>,
  ): Promise<[Scope[], number]> {
    try {
      return await this.scopeRepository.findAndCount({
        ...pagination,
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  /**
   * Update scope configuration.
   * @param filterOptions
   * @param updateData
   */
  async updateScope(
    filterOptions: Partial<Scope>,
    updateData: Partial<Scope>,
  ): Promise<Scope> {
    if (!(await this.filterScope(filterOptions)))
      throw new BadRequestException('Scope not found');
    await this.scopeRepository.update({ ...filterOptions }, { ...updateData });
    return await this.filterScope(filterOptions);
  }

  /**
   * Delete scope configuration.
   * @param filterOptions
   */
  async deleteScopeConfiguration(filterOptions: Partial<Scope>): Promise<void> {
    if (!(await this.filterScope(filterOptions)))
      throw new BadRequestException('Scope not found');
    await this.scopeRepository.delete({ ...filterOptions });
  }
}
