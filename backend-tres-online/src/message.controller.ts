// message.controller.ts

import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { MessageService } from './message.service'; // Asegúrate de tener un servicio GameService
import { Message } from './message.entity';

@Controller('Message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get()
  findAll(): Promise<Message[]> {
    return this.messageService.findAll();
  }

 
}
