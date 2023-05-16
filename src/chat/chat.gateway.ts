import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/core/services';

@WebSocketGateway()
// {
//   cors: {
//     credentials: true,
//     methods: ['GET', 'POST'],
//     origin: ['http://locahost:3000'],
//   },
//   transports: ['polling', 'websocket'],
// }
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  handleConnection(client: Socket) {
    // Handle client connection
    console.log(`Client connected. ID: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Handle client disconnection
    console.log(`Client disconnected. ID: ${client.id}`);
  }

  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    client: Socket,
    payload: { name: string; userId: string },
  ) {
    const { name, userId } = payload;

    try {
      // Create room using Prisma
      const room = await this.prisma.rooms.create({
        data: {
          name,
        },
      });

      // Notify the client that the room has been created
      console.log('createdRoom', room);
      client.emit('roomCreated', { room });
    } catch (error) {
      console.error('Error creating room:', error);
      // Handle error and send an error response to the client
      client.emit('roomCreationError', { error: 'Failed to create room' });
    }
  }

  @SubscribeMessage('addUserToRoom')
  async handleAddUserToRoom(
    client: Socket,
    payload: { roomId: string; userId: string },
  ) {
    const { roomId, userId } = payload;

    try {
      // Check if the room exists
      const room = await this.prisma.rooms.findUnique({
        where: { id: roomId },
      });
      if (!room) {
        client.emit('roomNotFound', { error: 'Room not found' });
        return;
      }

      console.log('room found-', { room });

      // Add users to the room using Prisma
      const updatedRoom = await this.prisma.rooms.update({
        where: { id: roomId },
        data: {
          users: {
            connect: { id: userId },
          },
        },
        include: {
          users: true,
        },
      });

      // Notify the client that the users have been added to the room
      client.emit('usersAddedToRoom', { room: updatedRoom });

      console.log(updatedRoom);
    } catch (error) {
      console.error('Error adding users to room:', error);
      // Handle error and send an error response to the client
      client.emit('usersAdditionError', {
        error: 'Failed to add users to room',
      });
    }
  }

  // Implement additional event handlers as needed
}
