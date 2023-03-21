import { CacheModule, Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import DatabaseConfig from './database/config';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import { CacheConfigService } from './config/redis';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    SharedModule,
    AuthModule,
    ApplicationModule,
    DatabaseConfig,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
