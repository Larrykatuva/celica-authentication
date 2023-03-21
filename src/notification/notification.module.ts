import { Module } from '@nestjs/common';
import { NodeMailerService } from './services/nodemailer.service';

@Module({
  imports: [],
  providers: [NodeMailerService],
  controllers: [],
  exports: [NodeMailerService],
})
export class NotificationModule {}
