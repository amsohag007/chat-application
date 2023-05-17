import { Injectable } from '@nestjs/common';
import { Messages, RoomTypeEnum, Rooms } from '@prisma/client';
import { PrismaService } from '../../core/services';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createRoom(
    userId: string,
    name: string,
    type: RoomTypeEnum,
    branchId: string,
  ): Promise<Rooms> {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: { rooms: true },
    });

    const room = await this.prisma.rooms.create({
      data: {
        name,
        type,
        branchId,
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
  ): Promise<Messages> {
    const message = await this.prisma.messages.create({
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
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      include: { rooms: true },
    });

    return user.rooms;
  }

  // async getRoomsByBranchId(branchId: string) {
  //   const rooms = await this.prisma.rooms.findUnique({
  //     where: { branchId:branchId},
  //   });

  //   return rooms;
  // }

  async getMessagesByRoomId(roomId: string) {
    const messages = await this.prisma.messages.findMany({
      where: { roomId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });

    return messages;
  }
}
