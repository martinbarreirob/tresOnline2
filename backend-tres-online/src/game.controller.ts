// game.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { GameService } from './game.service'; // Asegúrate de tener un servicio GameService
import { Game } from './game.entity';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get()
  findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Get('/playerGame/:id')
  findPlayerGame(@Param('id') id: number): Promise<Game> {
    return this.gameService.findPlayerGame(id);
  }

  @Get('/free/')
  findFreeGame(): Promise<Game> {
    return this.gameService.findFreeGame();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Game> {
    return this.gameService.findOne(id);
  }

  @Post()
  create(@Body() gameData: { board: string, status: number, playerXid: number, playerOid: number, turn: 'X' | 'O' , winX: number, winO: number}): Promise<Game> {
    return this.gameService.create(gameData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() gameData: { board?: any, status?: number, playerXid?: number, playerOid?: number, turn?: 'X' | 'O', winX?: number, winO?: number }): Promise<Game> {
    return this.gameService.update(id, gameData);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.gameService.delete(id);
  }
}
