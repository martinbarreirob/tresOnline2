//socket.service.ts

import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';  // No olvides importar Observable

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  public socket: any;

  constructor() {
    this.socket = io.connect('http://192.168.0.37:3000'); // Asume que tu servidor backend corre en el puerto 3000
  }

  // Método para emitir eventos
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  emitDisconnect(eventName: string) {
    this.socket.emit(eventName);
  }

  // Método para escuchar eventos desde el servidor
  listen<T>(eventName: string): Observable<T> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }

  onPlayerDisconnected(): Observable<any> {
    return this.socket.fromEvent('disconnected');
  }



}
