import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MessagesService } from './messages.service';
@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get(':gameId')
  getMessages(@Param() { gameId }: { gameId: string }) {
    return this.messagesService.getMessages(gameId);
  }
}
