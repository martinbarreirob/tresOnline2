import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: "http://localhost:4200",  // URL de tu frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
})
export class AppGateway {
  @WebSocketServer() server: Server;

  // Esta función se llama cuando un jugador se une al juego
  handleConnection(client: Socket): void {
   // console.log(`Usuario con ID ${client.id} se ha conectado`); Esto es para la consola del backend
    this.server.emit('nuevo-usuario', `Usuario con ID ${client.id} se ha conectado`);
  }


  @SubscribeMessage('player-connected')
  handlePlayerConnected(client: Socket, data: any) {
    console.log('Nuevo jugador conectado:', data);
    client.broadcast.emit('new-player', data);
  }

  @SubscribeMessage('game-updated')
  handleGameUpdated(client: Socket, data: any) {
    console.log('Nuevo jugador conectado:', data);
    client.broadcast.emit('new-player', data);
  }


  @SubscribeMessage('create-game')
  handleCreateGame(client: Socket, payload: any): void {
    console.log(`${payload.playerName} created the game ${payload.gameId}`);
    client.broadcast.emit('game-created', payload);
  }

}
