import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditTrail } from './entities/auditTrail.entity';
import { AuditTrailService } from './services/auditTrail.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditTrail])],
  providers: [AuditTrailService],
  controllers: [],
  exports: [AuditTrailService],
})
export class AuditTrailModule {}
