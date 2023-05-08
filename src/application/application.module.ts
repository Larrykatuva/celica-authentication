import { Module } from '@nestjs/common';
import { AppService } from './services/app.service';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from './entities/app.entity';
import { SharedModule } from '../shared/shared.module';
import { GrantCodeService } from './services/grantCode.service';
import { GrantCode } from './entities/grantCode.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConstants } from '../auth/constants/auth.contants';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([App, GrantCode]),
    SharedModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GrantCodeService],
  exports: [AppService, GrantCodeService],
})
export class ApplicationModule {}
