// game.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
  ) {}

  async findAll(): Promise<Game[]> {
    return await this.gameRepository.find();
  }

  async findFreeGame(): Promise<Game> {
    const game = await this.gameRepository
      .createQueryBuilder('game')
      .where('game.status = 0')
      .orWhere('game.playerXid = 0 OR game.playerOid = 0 ')
      .getOne();

    return game;
  }

  async findPlayerGame(id: number): Promise<Game> {
    const game = await this.gameRepository
      .createQueryBuilder('game')
      .where('game.playerXid = :id', { id })
      .orWhere('game.playerOid = :id', { id })
      .getOne();

    return game;
}


async findOne(id: number): Promise<Game> {
  const game = await this.gameRepository.findOne({ where: { id: id } });
  if (!game) {
    throw new NotFoundException(`Game with ID ${id} not found`);
  }
  return game;
}


  async create(data: { board: string, status: number, playerXid: number, playerOid: number, turn: 'X' | 'O', winX: number, winO: number }): Promise<Game> {
    const game = this.gameRepository.create(data);
    return await this.gameRepository.save(game);
  }

  async update(id: number, data: { board?: string, status?: number, playerXid?: number, playerOid?: number, turn?: 'X' | 'O' , winX?: number, winO?: number}): Promise<Game> {
    const game = await this.findOne(id); // This will throw an exception if not found
    this.gameRepository.merge(game, data);
    return await this.gameRepository.save(game);
  }

  async delete(id: number): Promise<void> {
    const game = await this.findOne(id); // This will throw an exception if not found
    await this.gameRepository.remove(game);
  }
}
