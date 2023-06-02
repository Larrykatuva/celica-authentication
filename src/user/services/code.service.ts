import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Code } from '../entities/code.entity';
import { App } from '../../application/entities/app.entity';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';

@Injectable()
export class CodeService {
  constructor(private codeRepository: Repository<Code>) {}

  /**
   * Generates a random string code and transforms it to uppercase.
   * @private
   */
  generateRandomCode(): string {
    return Math.random().toString(36).slice(2, 7).toUpperCase();
  }

  async filterCode(
    filterOptions: FindOptionsWhere<Code>,
    options?: FindOneOptions<Code>,
  ): Promise<Code> {
    try {
      return await this.codeRepository.findOne({
        where: filterOptions,
        ...options,
      });
    } catch (error) {
      throw error;
    }
  }

  async updateCode(
    filterOptions: FindOptionsWhere<Code>,
    updateData: Partial<Code>,
  ): Promise<void> {
    if (!(await this.filterCode(filterOptions))) throw new NotFoundException();
    await this.codeRepository.update(filterOptions, updateData);
  }

  async filterCodeRecords(
    pagination: DefaultPagination,
    filterOptions?: FindOptionsWhere<Code>,
    options?: FindOneOptions<Code>,
  ): Promise<[Code[], number]> {
    try {
      return await this.codeRepository.findAndCount({
        where: filterOptions,
        ...options,
        ...pagination,
      });
    } catch (error) {
      throw error;
    }
  }

  async generateCode(app: App): Promise<string> {
    const code = this.generateRandomCode();
    if (
      await this.filterCode({
        app: { id: app.id },
        used: false,
        expired: false,
        code: code,
      })
    )
      return this.generateCode(app);
    await this.codeRepository.save({
      code: code,
      app: app,
    });
    return code;
  }
}
