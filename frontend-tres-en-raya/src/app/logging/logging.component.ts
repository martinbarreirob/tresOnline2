import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player, Game } from '../models/interfaces.model';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.css']
})
export class LoggingComponent implements OnInit{
  @Output() emitRegistered = new EventEmitter<void>();

  private baseUrl: string = 'http://192.168.0.42:3000/';
  public inputNombre: string = '';
  private socket: any;

  constructor (private http: HttpClient, private socketService: SocketService){
  }

  ngOnInit(): void {

  // Escuchar el evento de conexión del socket
  this.socketService.socket.on('connect', () => {
  });


  }

  registroUser(): void {
    if(this.inputNombre === ''){
      this.inputNombre = 'user';
    }

    // Obtenemos el ID del socket
    const socketId = this.socketService.socket.id;

    // Insertamos el jugador con el ID del socket
    this.insertPlayer(this.inputNombre, socketId).subscribe((player: Player) => {
      localStorage.setItem('player', JSON.stringify(player));
      this.emitRegistered.emit();
    });
  }

  insertPlayer(nombre: string, socketId: string) {
    const playerData = {
      nombre: nombre,
      socketId: socketId  // Enviamos el ID del socket al servidor
    };
    return this.http.post<Player>(`${this.baseUrl}player/`, playerData);
  }
}
