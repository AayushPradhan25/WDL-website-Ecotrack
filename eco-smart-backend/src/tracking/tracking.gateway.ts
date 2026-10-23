import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/tracking',
})
export class TrackingGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  afterInit() {
    console.log('TrackingGateway initialized — /tracking namespace ready');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Client emits { truckId, latitude, longitude } to update truck location
  @SubscribeMessage('updateLocation')
  async handleUpdateLocation(
    @MessageBody()
    data: { truckId: number; latitude: number; longitude: number },
    @ConnectedSocket() _client: Socket,
  ) {
    // Persist to DB
    await this.prisma.truck.update({
      where: { id: data.truckId },
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
        status: 'on-route',
        lastActive: new Date(),
      },
    });

    // Broadcast to all subscribed clients
    this.server.emit('locationUpdate', {
      truckId: data.truckId,
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: new Date(),
    });

    return { event: 'locationUpdate', data };
  }

  // Client subscribes to a specific truck"s location
  @SubscribeMessage('subscribeToTruck')
  handleSubscribeToTruck(
    @MessageBody() data: { truckId: number },
    @ConnectedSocket() client: Socket,
  ) {
    void client.join(`truck-${data.truckId}`);
    return { event: 'subscribed', data: { truckId: data.truckId } };
  }
}
