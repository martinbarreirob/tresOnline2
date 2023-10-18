import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Player } from './player.entity';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async findAll(): Promise<Player[]> {
    return await this.playerRepository.find();
  }

  async findOne(id: number): Promise<Player> {
    const player = await this.playerRepository.findOne({ where: { id: id } });
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    return player;
  }
  
  

  async create(data: { nombre: string }): Promise<Player> {
    const player = this.playerRepository.create(data);
    return await this.playerRepository.save(player);
  }

  async update(id: number, data: { nombre: string }): Promise<Player> {
    const player = await this.findOne(id); // This will throw an exception if not found
    this.playerRepository.merge(player, data);
    return await this.playerRepository.save(player);
  }

  async delete(id: number): Promise<void> {
    const player = await this.findOne(id); // This will throw an exception if not found
    await this.playerRepository.remove(player);
  }
}
