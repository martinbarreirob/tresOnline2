import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game.module'
import { PlayerModule } from './player.module';
import { Game } from './game.entity';
import { Player } from './player.entity';
import { AppGateway } from './app.gateway';
import { Message } from './message.entity';
import { MessageModule } from './message.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '192.168.0.37',
      port: 3306,
      username: 'martin', // Usuario por defecto en XAMPP
      password: 'abc123.,',     // Contraseña vacía por defecto en XAMPP
      database: 'tres_en_raya_db', // El nombre de tu base de datos
      entities: [Game, Player, Message], // Ubicación de tus entidades
      synchronize: true, // Esto creará/modificará las tablas automáticamente según tus entidades. Útil en desarrollo pero peligroso en producción.
    }),
    GameModule,
    PlayerModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
