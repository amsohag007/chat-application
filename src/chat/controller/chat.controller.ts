import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { RoomTypeEnum } from '@prisma/client';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('rooms/:userId')
  async createRoom(
    @Param('userId') userId: string,
    @Body() body: { name: string; type: RoomTypeEnum; branchId: string },
  ) {
    return this.chatService.createRoom(
      userId,
      body.name,
      body.type,
      body.branchId,
    );
  }

  @Get('rooms/:userId')
  async getRoomsByUserId(@Param('userId') userId: string) {
    return this.chatService.getRoomsByUserId(userId);
  }

  @Get('messages/:roomId')
  async getMessagesByRoomId(@Param('roomId') roomId: string) {
    return this.chatService.getMessagesByRoomId(roomId);
  }

  @Post('messages/:roomId')
  async createMessage(
    @Param('roomId') roomId: string,
    @Body() body: { text: string; userId: string },
  ) {
    return this.chatService.createMessage(roomId, body.text, body.userId);
  }
}
