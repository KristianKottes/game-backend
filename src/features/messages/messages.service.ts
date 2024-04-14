import { Injectable } from '@nestjs/common';

import { CreateMessageDto } from './dto';
import { MessagesRepository } from './messages.repository';

@Injectable()
export class MessagesService {
  constructor(private messagesRepository: MessagesRepository) {}

  async create(data: CreateMessageDto) {
    const entity = this.messagesRepository.create(data);

    await this.messagesRepository.save(entity);

    const message = await this.messagesRepository.findOne({
      where: { id: entity.id },
      relations: ['sender', 'recipient', 'game'],
    });

    return message;
  }

  getMessages(game_id: string) {
    return this.messagesRepository.find({
      where: { game_id },
      relations: ['sender', 'recipient', 'game'],
    });
  }
}
