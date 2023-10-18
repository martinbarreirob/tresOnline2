import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game.module'
import { PlayerModule } from './player.module';
import { Game } from './game.entity';
import { Player } from './player.entity';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // Usuario por defecto en XAMPP
      password: '',     // Contraseña vacía por defecto en XAMPP
      database: 'tres_en_raya_db', // El nombre de tu base de datos
      entities: [Game, Player], // Ubicación de tus entidades
      synchronize: true, // Esto creará/modificará las tablas automáticamente según tus entidades. Útil en desarrollo pero peligroso en producción.
    }),
    GameModule,
    PlayerModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
