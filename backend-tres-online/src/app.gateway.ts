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

  @SubscribeMessage('create-game')
  handleCreateGame(client: Socket, payload: any): void {
    console.log(`${client.id} created the game ${payload.id}`);
    // Notify only the clients in that room (including the sender)
    this.server.emit('create-game', payload);

    // Join the room
    client.join(payload.id);
  }

  //Cuando un usuario se une a un juego avisa a todos los usuarios
  //Se usa para limpiar la partida de la lista y que así no entren dos personas a la misma
  @SubscribeMessage('list-games')
  handleListGame(client: Socket, payload: any): void {
    console.log(`${client.id} joined the game ${payload.id}`);

    this.server.emit('list-games', payload);
  }

  //Cuando un usuario entra a un juego notifica al dueño del juego la unión
  @SubscribeMessage('player-join-game')
  handleJoinGame(client: Socket, payload: any): void {
    console.log(`${payload} joined the game ${payload.id}`);
    // Join the room
    client.join(payload.id);
    // Notify only the clients in that room (including the sender)
    this.server.to(payload.id).emit('player-join-game', payload);
  }

  @SubscribeMessage('updated-game')
  handleGameUpdated(client: Socket, data: any) {
    console.log('Mesa de juego actualizada:', data);
    this.server.to(data.id).emit('updated-game', data);
  }

  @SubscribeMessage('restart-game')
  handleRestartGame(client: Socket, payload: any): void {
    console.log(`${payload.playerName} restart game ${payload}`);

    
    client.broadcast.emit('restart-game', payload);
  }

  @SubscribeMessage('player-disconnected')
  handleDisconnect(client: Socket) {
    // console.log('Client disconnected:', client.id);
    // Aquí puedes emitir un evento para informar a otros clientes sobre la desconexión
    this.server.emit('player-disconnected', { playerId: client.id });
  }

  

}
