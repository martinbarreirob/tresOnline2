// player.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { PlayerService } from './player.service';
import { Player } from './player.entity';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get()
  findAll(): Promise<Player[]> {
    return this.playerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Player> {
    return this.playerService.findOne(id);
  }

  @Post()
  create(@Body() playerData: { nombre: string, socketId: number }): Promise<Player> {
    return this.playerService.create(playerData);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() playerData: { nombre: string }): Promise<Player> {
    return this.playerService.update(id, playerData);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Promise<void> {
    return this.playerService.delete(id);
  }
}
