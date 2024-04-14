import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from './entities';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessagesService, MessagesRepository],
  exports: [MessagesService],
  controllers: [MessagesController],
})
export class MessagesModule {}
