import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditTrail } from '../entities/auditTrail.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { AppScope } from '../../scope/entities/appScope.entity';
import { Scope } from '../../scope/entities/scope.entity';
import { App } from '../../application/entities/app.entity';
import { User } from '../../user/entities/user.entity';
import { DefaultPagination } from '../../shared/interfaces/pagination.interface';

@Injectable()
export class AuditTrailService {
  constructor(
    @InjectRepository(AuditTrail)
    private auditTrailRepository: Repository<AuditTrail>,
  ) {}

  /**
   * Filter audit trail records
   * @param filterOptions
   * @param options
   */
  async filterAuditTrail(
    filterOptions: any,
    options?: FindOneOptions<AuditTrail>,
  ): Promise<AuditTrail> {
    try {
      return await this.auditTrailRepository.findOne({
        where: { ...filterOptions },
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }

  /**
   * Create an event trail log record.
   * @param data
   */
  @OnEvent('auditTrail.createLog')
  async handleCreateAudiTrail(data: {
    app?: App;
    user?: User;
    appScope?: AppScope;
    scope?: Scope;
    description: string;
  }) {
    await this.auditTrailRepository.save(data);
  }

  /**
   * Filter a paginated records of audit trails.
   * @param pagination
   * @param filterOptions
   * @param options
   */
  async filterAuditTrailRecords(
    pagination: DefaultPagination,
    filterOptions?: any,
    options?: FindOneOptions<AuditTrail>,
  ): Promise<[AuditTrail[], number]> {
    try {
      return await this.auditTrailRepository.findAndCount({
        where: { ...filterOptions },
        ...pagination,
        ...options,
      });
    } catch (error) {
      throw new BadRequestException(error.response);
    }
  }
}
