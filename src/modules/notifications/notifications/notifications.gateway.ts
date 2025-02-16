// modules/notifications/notifications.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    try {
      const token = client.handshake.auth?.token || client.handshake.query.token;
      
      if (!token || token !== process.env.SOCKET_AUTH_TOKEN) {
        console.error(`Unauthorized connection attempt from client: ${client.id}`);
        client.disconnect(); 
        return;
      }
      console.info(`Secure connection established for client: ${client.id}`);
    } catch (error) {
      console.error('Error during client connection', error);
      client.disconnect();
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
