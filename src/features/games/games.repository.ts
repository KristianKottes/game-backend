import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { BaseRepository } from '../common/base.repository';

import { Game } from './entities';

@Injectable()
export class GamesRepository extends BaseRepository<Game> {
  constructor(dataSource: DataSource) {
    super(Game, dataSource);
  }
}
