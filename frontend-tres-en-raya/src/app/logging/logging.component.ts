// logging.components.ts
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
    this.socket = this.socketService;
  }

  ngOnInit(): void {
  }

  registroUser(): void {
    if(this.inputNombre === ''){
      this.inputNombre = 'user';
    }

    this.insertPlayer(this.inputNombre).subscribe((player: Player) => {
      localStorage.setItem('player', JSON.stringify(player));
      this.emitRegistered.emit();

    });
  }

  insertPlayer(nombre: string) {
    const nombrePlayer = { nombre: nombre};
    return this.http.post<Player>(`${this.baseUrl}player/`, nombrePlayer);
  }
}
