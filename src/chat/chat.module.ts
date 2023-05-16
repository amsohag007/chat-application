import { Global, Module } from '@nestjs/common';
import { ChatService } from './services';
import { ChatController } from './controller';
import { ChatGateway } from './chat.gateway';

@Global()
@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
