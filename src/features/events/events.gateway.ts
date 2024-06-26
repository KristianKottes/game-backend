import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { GamesService } from '../games/games.service';
import { CreateMessageDto } from '../messages/dto';
import { MessagesService } from '../messages/messages.service';
import { User } from '../users';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private gamesService: GamesService,
    private messagesService: MessagesService,
  ) {}

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

  @SubscribeMessage('send-message')
  async sendMessage(@MessageBody() data: CreateMessageDto) {
    const message = await this.messagesService.create(data);

    this.server.emit('sent-message', message);
  }

  @SubscribeMessage('gave-up')
  async gaveUp(@MessageBody() data: { loser_id: string; game_id: string }) {
    const winner = await this.gamesService.gaveUp(data.game_id, data.loser_id);

    this.server.emit('gave-up', winner);
  }
}
