import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOneOptions, Not } from 'typeorm';

import { GameStatus } from '../common/enums';

import { CreateGameDto } from './dto';
import { Game } from './entities';
import { GamesRepository } from './games.repository';

@Injectable()
export class GamesService {
  constructor(private gamesRepository: GamesRepository) {}

  async create({ owner_id }: CreateGameDto) {
    const existingGame = await this.gamesRepository.findOneBy({
      owner_id,
      status: Not(GameStatus.Finished),
    });

    if (!!existingGame) {
      existingGame.status = GameStatus.Waiting;
      await existingGame.save();

      return existingGame;
    }

    const entity = this.gamesRepository.create({ owner_id, current_turn_user_id: owner_id });

    await this.gamesRepository.save(entity);

    await this.generateMaze(entity.id);

    return entity;
  }

  async getGameById(id: string, options?: FindOneOptions<Game>) {
    const game = await this.gamesRepository.findOne({
      ...options,
      where: { ...options?.where, id },
    });

    if (!game) {
      throw new NotFoundException();
    }

    return game;
  }

  async getGameByOwnerId(ownerId: string, options?: FindOneOptions<Game>) {
    const game = await this.gamesRepository.findOne({
      ...options,
      where: { ...options?.where, owner_id: ownerId },
    });

    if (!game) {
      throw new NotFoundException();
    }

    return game;
  }

  async getCurrentGame(id: string) {
    const game = await this.gamesRepository.findOne({
      where: [{ status: GameStatus.InProcess, id }],
      relations: ['currentTurnUser'],
    });

    if (!game) {
      throw new NotFoundException();
    }

    return game;
  }

  async getGames(owner_id: string) {
    const games = await this.gamesRepository.find({
      where: { owner_id: Not(owner_id), status: GameStatus.Waiting },
      relations: ['owner'],
    });

    return games;
  }

  async joinToGame(id: string, member_id: string) {
    const gameToUpdate = await this.getGameById(id);

    gameToUpdate.member_id = member_id;
    gameToUpdate.status = GameStatus.InProcess;

    const game = await gameToUpdate.save();

    return game;
  }

  async changeTurn(id: string) {
    const game = await this.getGameById(id);

    if (game.owner_id === game.current_turn_user_id) {
      game.current_turn_user_id = game.member_id;
    } else {
      game.current_turn_user_id = game.owner_id;
    }

    await game.save();

    return this.getGameById(id, { relations: ['currentTurnUser'] });
  }

  async cancelGame(ownerId: string) {
    const game = await this.getGameByOwnerId(ownerId);

    game.status = GameStatus.Canceled;

    await game.save();

    return game;
  }

  async gameOver(gameId: string, winnerId: string) {
    const game = await this.getGameById(gameId);

    game.status = GameStatus.Finished;
    game.winner_id = winnerId;

    await game.save();

    return game;
  }

  async generateMaze(gameId: string) {
    const game = await this.gamesRepository.findOneBy({ id: gameId });

    if (!game) {
      throw new NotFoundException();
    }

    if (game.maze.length > 0) {
      return game.maze;
    }

    const x = 10,
      y = 10;

    // Establish variables and starting grid
    const totalCells = x * y;
    const cells: number[][][] = [];
    const invisible: boolean[][] = [];
    for (let i = 0; i < y; i++) {
      cells[i] = [];
      invisible[i] = [];
      for (let j = 0; j < x; j++) {
        cells[i][j] = [0, 0, 0, 0];
        invisible[i][j] = true;
      }
    }

    // Set a random position to start from
    let currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
    const path = [currentCell];
    invisible[currentCell[0]][currentCell[1]] = false;
    let visited = 1;

    // Loop through all available cell positions
    while (visited < totalCells) {
      // Determine neighboring cells
      const pot = [
        [currentCell[0] - 1, currentCell[1], 0, 2],
        [currentCell[0], currentCell[1] + 1, 1, 3],
        [currentCell[0] + 1, currentCell[1], 2, 0],
        [currentCell[0], currentCell[1] - 1, 3, 1],
      ];
      const neighbors = [];

      // Determine if each neighboring cell is in game grid, and whether it has already been checked
      for (let l = 0; l < 4; l++) {
        if (
          pot[l][0] > -1 &&
          pot[l][0] < y &&
          pot[l][1] > -1 &&
          pot[l][1] < x &&
          invisible[pot[l][0]][pot[l][1]]
        ) {
          neighbors.push(pot[l]);
        }
      }

      // If at least one active neighboring cell has been found
      if (neighbors.length) {
        // Choose one of the neighbors at random
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];

        // Remove the wall between the current cell and the chosen neighboring cell
        cells[currentCell[0]][currentCell[1]][next[2]] = 1;
        cells[next[0]][next[1]][next[3]] = 1;

        // Mark the neighbor as visited, and set it as the current cell
        invisible[next[0]][next[1]] = false;
        visited++;
        currentCell = [next[0], next[1]];
        path.push(currentCell);
      }
      // Otherwise go back up a step and keep going
      else {
        currentCell = path.pop() ?? [];
      }
    }

    game.maze = cells;

    game.save();

    return cells;
  }
}
