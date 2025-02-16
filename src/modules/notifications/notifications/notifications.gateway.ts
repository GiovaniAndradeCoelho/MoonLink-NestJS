// modules/notifications/notifications.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    try {
      console.info(`New connection from client: ${client.id}`);
    } catch (error) {
      console.error('Error during client connection', error);
    }
  }

  handleDisconnect(client: Socket): void {
    try {
      console.info(`Client disconnected: ${client.id}`);
    } catch (error) {
      console.error('Error during client disconnection', error);
    }
  }

  sendNotification(notification: any): void {
    this.server.emit('notification', notification);
  }
}
