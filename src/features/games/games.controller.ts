import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Authorized } from '../auth';
import { IRequestWithUser } from '../auth/interfaces';

import { CreateGameDto, JoinToGameDto } from './dto';
import { GamesService } from './games.service';
@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post('create')
  @Authorized()
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get('list')
  @Authorized()
  getGames(@Req() req: IRequestWithUser) {
    return this.gamesService.getGames(req.user.id);
  }

  @Get('current-game/:id')
  @Authorized()
  getGame(@Param() { id }: { id: string }) {
    return this.gamesService.getCurrentGame(id);
  }

  @Get('current-game')
  @Authorized()
  getCurrentGame(@Req() req: IRequestWithUser) {
    return this.gamesService.getCurrentGame(req.user.id);
  }

  @Post('join-to-game')
  @Authorized()
  joinToGame(@Req() req: IRequestWithUser, @Body() { id }: JoinToGameDto) {
    return this.gamesService.joinToGame(id, req.user.id);
  }
}
