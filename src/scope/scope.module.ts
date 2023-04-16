import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scope } from './entities/scope.entity';
import { AppScope } from './entities/appScope.entity';
import { AuditTrailModule } from '../auditTrail/auditTrail.module';
import { ScopeService } from './services/scope.service';
import { AppScopeService } from './services/appScope.service';

@Module({
  imports: [TypeOrmModule.forFeature([Scope, AppScope]), AuditTrailModule],
  providers: [ScopeService, AppScopeService],
  controllers: [],
  exports: [ScopeService],
})
export class ScopeModule {}
