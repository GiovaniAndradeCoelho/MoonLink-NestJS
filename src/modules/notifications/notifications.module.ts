// src/modules/notifications/notifications.module.ts
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications/notifications.service';
import { NotificationsGateway } from './notifications/notifications.gateway';

@Module({
  providers: [NotificationsGateway, NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
