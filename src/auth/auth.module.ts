import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NotificationModule } from '../notification/notification.module';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ApplicationModule } from '../application/application.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/auth.contants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScopeModule } from "../scope/scope.module";

@Module({
  imports: [
    NotificationModule,
    UserModule,
    ApplicationModule,
    ScopeModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
