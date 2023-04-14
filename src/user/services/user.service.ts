import { Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Create a user.
   * @param user
   */
  async createUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  /**
   *Filter user by filter options and return User matching filter.
   * @param filterOptions
   */
  async filterUser(filterOptions: any): Promise<User> {
    try {
      return await this.userRepository.findOneBy({ ...filterOptions });
    } catch (error: any) {
      return null;
    }
  }

  /**
   * Filter user by filter options and return users matching query.
   * @param filterOptions
   * @param options
   */
  async filterUsers(filterOptions: any, options: any): Promise<User[]> {
    return await this.userRepository.find({
      where: { ...filterOptions },
      ...options,
    });
  }

  /**
   * Filter users and get a list of users and count of tittal users.
   * @param pagination
   * @param filterOptions
   * @param options
   */
  async filterPaginatedUsers(
    pagination: DefaultPagination = { skip: 0, limit: 10 },
    filterOptions?: any,
    options?: any,
  ): Promise<[User[], number]> {
    return await this.userRepository.findAndCount({
      where: { ...filterOptions },
      ...pagination,
      ...options,
    });
  }

  /**
   * Update user by filter options with the update options.
   * @param filterOptions
   * @param updateOptions
   */
  async updateUser(
    filterOptions: any,
    updateOptions: Partial<User>,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(
      { ...filterOptions },
      { ...updateOptions },
    );
  }
}
