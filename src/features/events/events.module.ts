import { Module } from '@nestjs/common';

import { GamesModule } from '../games/games.module';

import { EventsGateway } from './events.gateway';

@Module({
  imports: [GamesModule],
  providers: [EventsGateway],
})
export class EventsModule {}
