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

  private roomByClientId: { [clientId: string]: string } = {};

  @SubscribeMessage('player-connected')
  handlePlayerConnected(client: Socket, data: any) {
    console.log('Nuevo jugador conectado:', data);
    client.broadcast.emit('player-connected', data);
  }


  @SubscribeMessage('create-game')
  handleCreateGame(client: Socket, payload: any): void {
    console.log(`${client.id} created the game ${payload.id}`);
    this.roomByClientId[client.id] = payload.id;

    
    client.join(payload.id);
    this.server.emit('create-game', payload);
  }

  //Cuando un usuario se une a un juego avisa a todos los usuarios
  //Se usa para limpiar la partida de la lista y que así no entren dos personas a la misma
  @SubscribeMessage('list-games')
  handleListGame(client: Socket, payload: any): void {
    console.log(`${client.id} joined the game ${payload.id}`);

    this.server.emit('list-games', payload);
  }

  @SubscribeMessage('player-join-game')
  handleJoinGame(client: Socket, payload: any): void {
    console.log(`${payload} joined the game ${payload.id}`);
    this.roomByClientId[client.id] = payload.id;
    client.join(payload.id);
    this.server.to(payload.id).emit('player-join-game', payload);
  }

  @SubscribeMessage('updated-game')
  handleGameUpdated(client: Socket, data: any) {
    console.log('Mesa de juego actualizada:',);
    this.server.to(data.id).emit('updated-game', data);
  }

  @SubscribeMessage('updated-winner-game')
  handleGameWinnerUpdate(client: Socket, payload: any): void {
    console.log(`${payload} win the game ${payload.id}`);
    this.server.to(payload.id).emit('updated-winner-game', payload);
  }

  @SubscribeMessage('ready-restart-game')
  handleReadyRestartGame(client: Socket, payload: any): void {
    console.log(`${client.id} ready restart game ${payload.id}`);

    client.broadcast.to(payload.id).emit('ready-restart-game', payload);
  }

  @SubscribeMessage('restart-game')
  handleRestartGame(client: Socket, payload: any): void {
    console.log(`${payload.playerName} restart game ${payload.id}`);

    this.server.to(payload.id).emit('restart-game', payload);
  }


  @SubscribeMessage('clear-own-game')
  handleClearListGames(client: Socket): void {
    const roomId = this.getRoomId(client.id);
    if (roomId) {
      console.log(`Player ${client.id} leaves game ${roomId}.`);
      this.server.emit('clear-own-game', roomId);
    }
  }

  //Disconnect 

  @SubscribeMessage('leaveGame')
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const roomId = this.getRoomId(client.id);
    if (roomId) {
      this.server.to(roomId).emit('player-disconnected', { clientId: client.id, roomId });
      this.server.emit('clear-game', roomId);
      delete this.roomByClientId[client.id];  // Remove the client's room info since they have disconnected
    }
  }

  
  private getRoomId(clientId: string): string | null {
    console.log('function get room');
    return this.roomByClientId[clientId];
    
  }

  
  //Message events
  @SubscribeMessage('messageEmited')
  handleMessageEdited(client: Socket, mensaje: any): void {
    console.log(`User ${client.id} send a message.`);

    client.broadcast.to(mensaje.roomId).emit('messageEmited', mensaje);

  }
}