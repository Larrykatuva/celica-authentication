import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { App } from '../entities/app.entity';
import {
  DeleteResult,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
  UpdateResult,
} from 'typeorm';
import { RegisterAppDto } from '../dto/app.dtos';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(App)
    private readonly appRepository: Repository<App>,
  ) {}

  /**
   * Create app by name.
   * @param data
   */
  async createApp(data: RegisterAppDto): Promise<App> {
    if (await this.filterApp({ name: data.name }))
      throw new BadRequestException('App already registered');
    let redirect_uri = '';
    for (let i = 0; i < data.redirectUri.length; i++) {
      if (i != 0) redirect_uri = redirect_uri + ',';
      redirect_uri = redirect_uri + data.redirectUri[i];
    }
    return await this.appRepository.save({
      clientId: await this.generateRandomString(40),
      clientSecret: await this.generateRandomString(50),
      name: data.name,
      logo: data.logo,
      description: data.description,
      redirectUri: redirect_uri,
      clientType: data.clientType,
      acceptLegalTerms: data.acceptLegalTerms,
    });
  }

  /**
   * Generate random string of characters.
   */
  async generateRandomString(length: number): Promise<string> {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Filter app by filter options.
   * @param filterOptions
   * @param options
   */
  async filterApp(
    filterOptions: FindOptionsWhere<App>,
    options?: FindOneOptions<App>,
  ): Promise<App | null> {
    try {
      return await this.appRepository.findOne({
        where: filterOptions,
        ...options,
      });
    } catch (error) {
      return null;
    }
  }

  /**
   * Filter apps by filter options and other optional queries.
   * @param filterOptions
   * @param options
   */
  async filterApps(
    filterOptions: FindOptionsWhere<App>,
    options: FindOneOptions<App>,
  ): Promise<App[]> {
    return await this.appRepository.find({
      where: filterOptions,
      ...options,
    });
  }

  /**
   * Get paginated list of app matching the filter options and options such as related tables and select columns.
   * @param pagination
   * @param filterOptions
   * @param options
   */
  async filterPaginatedApps(
    pagination: { skip: number; limit: number } = { skip: 0, limit: 10 },
    filterOptions?: FindOptionsWhere<App>,
    options?: FindOneOptions<App>,
  ): Promise<[App[], number]> {
    try {
      return await this.appRepository.findAndCount({
        where: filterOptions,
        ...pagination,
        ...options,
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update app by filter options with update fields passed.
   * @param filterOptions
   * @param updateFields
   */
  async updateApp(
    filterOptions: FindOptionsWhere<App>,
    updateFields: Partial<App>,
  ): Promise<UpdateResult> {
    return await this.appRepository.update(filterOptions, updateFields);
  }

  /**
   * Delete app by filter options.
   * @param filterOptions
   */
  async deleteApp(filterOptions: FindOptionsWhere<App>): Promise<DeleteResult> {
    return await this.appRepository.delete(filterOptions);
  }
}
