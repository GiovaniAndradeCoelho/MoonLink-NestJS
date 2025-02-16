// modules/notifications/notifications.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly notificationsGateway: NotificationsGateway) {}

  notify(change: any): void {
    try {
      const notificationPayload = {
        message: 'A change has been made',
        data: change,
        timestamp: new Date().toISOString(),
      };

      this.notificationsGateway.sendNotification(notificationPayload);
    } catch (error) {
      this.logger.error('Error sending notification', error);
    }
  }
}
