import { Injectable } from '@nestjs/common';
import { Message, Rooms } from '@prisma/client';
import { PrismaService } from '../../core/services';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createRoom(userId: string, name: string): Promise<Rooms> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { rooms: true },
    });

    const room = await this.prisma.rooms.create({
      data: {
        name,
        users: { connect: { id: userId } },
      },
      include: { users: true },
    });

    return room;
  }

  async createMessage(
    roomId: string,
    text: string,
    userId: string,
  ): Promise<Message> {
    const message = await this.prisma.message.create({
      data: {
        text,
        userId,
        roomId,
      },
      include: { user: true },
    });

    return message;
  }

  async getRoomsByUserId(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { rooms: true },
    });

    return user.rooms;
  }

  async getMessagesByRoomId(roomId: string) {
    const messages = await this.prisma.message.findMany({
      where: { roomId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });

    return messages;
  }
}
