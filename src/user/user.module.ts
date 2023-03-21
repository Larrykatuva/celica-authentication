import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UserService],
  controllers: [],
  exports: [UserService],
})
export class UserModule {}
