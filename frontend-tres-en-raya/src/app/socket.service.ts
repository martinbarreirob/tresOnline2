import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';  // No olvides importar Observable

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor() {
    this.socket = io.connect('http://localhost:3000'); // Asume que tu servidor backend corre en el puerto 3000

    // this.socket.on('nuevo-usuario', (message: string) => {
    //   console.log(message);
    // });
  }

  // Método para emitir eventos
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  // Método para escuchar eventos desde el servidor
  listen(eventName: string) {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data:any) => {
        subscriber.next(data);
      });
    });
  }

  emitMove(payload: any): void {
    this.socket.emit('movimiento-jugador', payload);
  }

  emitJoinGame(payload: any): void {
    this.socket.emit('join-game', payload);
  }

  listenForMoves(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('movimiento-jugador', (data: any) => {
        observer.next(data);
      });
    });
  }

  // Esta función se suscribe al evento "player-joined"
  onPlayerJoined(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('player-joined', (data: any) => {
        observer.next(data);
      });
    });
  }
}
