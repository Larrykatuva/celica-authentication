import { Module } from '@nestjs/common';
import { AppService } from './services/app.service';
import { AppController } from './controllers/app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App } from './entities/app.entity';
import { SharedModule } from '../shared/shared.module';
import { GrantCodeService } from './services/grantCode.service';
import { GrantCode } from './entities/grantCode.entity';

@Module({
  imports: [TypeOrmModule.forFeature([App, GrantCode]), SharedModule],
  controllers: [AppController],
  providers: [AppService, GrantCodeService],
  exports: [AppService, GrantCodeService],
})
export class ApplicationModule {}
