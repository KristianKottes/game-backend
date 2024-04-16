import { Controller, Get, Param } from '@nestjs/common';

import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':gameId')
  getMessages(@Param() { gameId }: { gameId: string }) {
    return this.messagesService.getMessages(gameId);
  }
}
