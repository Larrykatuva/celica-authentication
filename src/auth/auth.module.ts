import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { NotificationModule } from '../notification/notification.module';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { ApplicationModule } from '../application/application.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants/auth.contants';

@Module({
  imports: [
    NotificationModule,
    UserModule,
    ApplicationModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
