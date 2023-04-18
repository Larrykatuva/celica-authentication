import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RoleService } from './services/role.service';
import { RoleController } from './controllers/role.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtConstants } from '../auth/constants/auth.contants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: jwtConstants.secret,
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRY') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UserService, RoleService],
  controllers: [RoleController],
  exports: [UserService, RoleService],
})
export class UserModule {}
