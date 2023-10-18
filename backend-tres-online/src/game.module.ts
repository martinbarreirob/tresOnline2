// game.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { Game } from './game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game])], // Importar entidad Game para TypeOrmModule
  providers: [GameService], // Registrar el servicio
  controllers: [GameController], // Registrar el controlador
})
export class GameModule {}
