import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { GamesService } from '../games/games.service';
import { User } from '../users';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private gamesService: GamesService) {}

  @SubscribeMessage('join-game')
  async joinGame(@MessageBody() data: { id: string; member_id: string }) {
    const game = await this.gamesService.joinToGame(data.id, data.member_id);

    this.server.emit('start-game', game);
  }

  @SubscribeMessage('change-turn')
  async changeTurn(@MessageBody() data: { gameId: string }) {
    const game = await this.gamesService.changeTurn(data.gameId);

    this.server.emit('change-turn', game);
  }

  @SubscribeMessage('create-game')
  async createGame(@MessageBody() data: { ownerId: string }) {
    const createdGame = await this.gamesService.create({ owner_id: data.ownerId });

    const game = await this.gamesService.getGameById(createdGame.id, { relations: ['owner'] });

    this.server.emit('created-game', game);
  }

  @SubscribeMessage('cancel-game')
  async cancelGame(@MessageBody() data: { ownerId: string }) {
    const canceledGame = await this.gamesService.cancelGame(data.ownerId);

    const game = await this.gamesService.getGameById(canceledGame.id, { relations: ['owner'] });

    this.server.emit('canceled-game', game);
  }

  @SubscribeMessage('game-over')
  async gameOver(@MessageBody() data: { gameId: string; winner: User }) {
    await this.gamesService.gameOver(data.gameId, data.winner.id);

    this.server.emit('game-over', { winner: data.winner });
  }
}
