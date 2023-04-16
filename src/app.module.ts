import { CacheModule, Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import DatabaseConfig from './database/config';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import { CacheConfigService } from './config/redis';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScopeModule } from './scope/scope.module';
import { AuditTrailModule } from './auditTrail/auditTrail.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    SharedModule,
    AuthModule,
    ApplicationModule,
    ScopeModule,
    AuditTrailModule,
    DatabaseConfig,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
