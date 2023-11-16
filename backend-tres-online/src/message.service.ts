// game.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) { }

  async findAll(): Promise<Message[]> {
    return await this.messageRepository.find();
  }

  async findAllMessagesWithPlayers(): Promise<any[]> {
    const consulta = `
        SELECT message.*, player.nombre as userName FROM message
        LEFT JOIN player ON message.userId = player.id
      `;

    return this.messageRepository.query(consulta);
  }

  async create(data: { text: string, userId: number }): Promise<Message> {
    const message = this.messageRepository.create(data);
    return await this.messageRepository.save(message);
  }
}
