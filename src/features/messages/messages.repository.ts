import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { BaseRepository } from '../common/base.repository';

import { Message } from './entities';

@Injectable()
export class MessagesRepository extends BaseRepository<Message> {
  constructor(dataSource: DataSource) {
    super(Message, dataSource);
  }
}
