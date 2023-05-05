import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scope } from './entities/scope.entity';
import { AppScope } from './entities/appScope.entity';
import { AuditTrailModule } from '../auditTrail/auditTrail.module';
import { ScopeService } from './services/scope.service';
import { AppScopeService } from './services/appScope.service';
import { ScopeController } from './controllers/scope.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants/auth.contants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AppScopeController } from './controllers/appScope.controller';
import { AppModule } from '../app.module';
import { ApplicationModule } from '../application/application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scope, AppScope]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY') },
      }),
      inject: [ConfigService],
    }),
    AuditTrailModule,
    UserModule,
    ApplicationModule,
  ],
  providers: [ScopeService, AppScopeService],
  controllers: [ScopeController, AppScopeController],
  exports: [ScopeService, AppScopeService],
})
export class ScopeModule {}
