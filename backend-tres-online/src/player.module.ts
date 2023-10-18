// player.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { Player } from './player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Player])], // Importar entidad Game para TypeOrmModule
  providers: [PlayerService], // Registrar el servicio
  controllers: [PlayerController], // Registrar el controlador
})
export class PlayerModule {}

