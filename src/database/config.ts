import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { App } from '../application/entities/app.entity';
import { Role } from '../user/entities/role.entity';
import { GrantCode } from '../application/entities/grantCode.entity';
import { Scope } from '../scope/entities/scope.entity';
import { AppScope } from '../scope/entities/appScope.entity';
import { AuditTrail } from '../auditTrail/entities/auditTrail.entity';
/**
 * TypeOrm database connection configuration
 * Main configuration to be imported in app module
 * (main application module configuration)
 */

@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.get<string>('DATABASE_HOST'),
      port: +this.configService.get<number>('DATABASE_PORT'),
      username: this.configService.get<string>('DATABASE_USER'),
      password: this.configService.get<string>('DATABASE_PASSWORD'),
      database: this.configService.get<string>('DATABASE_NAME'),
      entities: [App, User, Role, GrantCode, Scope, AppScope, AuditTrail],
      synchronize: this.configService.get<boolean>('DATABASE_SYNC'),
      logging: this.configService.get<boolean>('LOGGER'),
      subscribers: [],
      migrations: [],
    };
  }
}

export default TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
});
