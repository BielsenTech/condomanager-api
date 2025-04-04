import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { UserModule } from '../modules/user/user.module';

@Module({
  imports: [UserModule],
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
})
export class WebsocketsModule {} 