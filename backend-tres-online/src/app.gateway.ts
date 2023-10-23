//app.gatewat.ts

import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: true,  // URL de tu frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  }
})
export class AppGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('player-connected')
  handlePlayerConnected(client: Socket, data: any) {
    console.log('Nuevo jugador conectado:', data);
    client.broadcast.emit('player-connected', data);
  }

  @SubscribeMessage('game-updated')
  handleGameUpdated(client: Socket, data: any) {
    console.log('Mesa de juego actualizada:', data);
    this.server.emit('game-updated', data);
  }

  @SubscribeMessage('create-game')
  handleCreateGame(client: Socket, payload: any): void {
    console.log(`${payload.playerName} created the game ${payload.gameId}`);
    client.broadcast.emit('game-created', payload);
  }

  @SubscribeMessage('restart-game')
  handleRestartGame(client: Socket, payload: any): void {
    console.log(`${payload.playerName} restart game ${payload}`);
    client.broadcast.emit('restart-game', payload);
  }

  @SubscribeMessage('player-disconnected')
  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    // Aquí puedes emitir un evento para informar a otros clientes sobre la desconexión
    this.server.emit('player-disconnected', { playerId: client.id });
  }

  

}
