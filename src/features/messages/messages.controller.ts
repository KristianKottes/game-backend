import { Controller, Get, Param } from '@nestjs/common';

import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':gameId')
  getMessages(@Param() { game_id }: { game_id: string }) {
    return this.messagesService.getMessages(game_id);
  }
}
