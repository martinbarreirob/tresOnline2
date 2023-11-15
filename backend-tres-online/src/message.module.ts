// message.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from './message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Message])], // Importar entidad Message para TypeOrmModule
  providers: [MessageService], // Registrar el servicio
  controllers: [MessageController], // Registrar el controlador
})
export class GameModule {}
