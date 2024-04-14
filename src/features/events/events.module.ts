import { Module } from '@nestjs/common';

import { GamesModule } from '../games/games.module';
import { MessagesModule } from '../messages/messages.module';

import { EventsGateway } from './events.gateway';

@Module({
  imports: [GamesModule, MessagesModule],
  providers: [EventsGateway],
})
export class EventsModule {}
