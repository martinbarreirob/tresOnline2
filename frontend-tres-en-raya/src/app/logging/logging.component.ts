import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Player, Game } from '../models/interfaces.model';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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

      this.searchForGame().subscribe(freeGame => {
        if (freeGame) {
          let enterFreeGame = {
            playerOid: player.id,
            status: 1,
          };

          this.http.put<Game>(`${this.baseUrl}game/${freeGame.id}`, enterFreeGame).subscribe(
            updateGame => {
              console.log('Usuario añadido a Juego Disponible');
              this.socket.emit("player-connected", player);

              //Oculta formulario y muestra tablero
              this.emitRegistered.emit();
            },
            error => {
              console.error('Error al actualizar el juego:', error); // <-- Agrega esta línea
            }
          );

        } else {
          console.log('No hay juego libre. Creando uno nuevo...');
          this.createGame(player.id).subscribe((game: Game) => {
            this.emitRegistered.emit();
          });
        }
      });
    });
  }


  insertPlayer(nombre: string) {
    const nombrePlayer = { nombre: nombre};
    return this.http.post<Player>(`${this.baseUrl}player/`, nombrePlayer);
  }


  createGame(playerId: number){
    const gameData = {
      board: JSON.stringify([
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ]),
      status: 0,
      playerXid: playerId,
      playerOid: "",
      turn: 'X',
    }
    return this.http.post<Game>(`${this.baseUrl}game/`, gameData);
  }


  searchForGame(): Observable<Game | null> {
    return this.http.get<Game>(`${this.baseUrl}game/free`).pipe(
      catchError(error => {
        //console.error('Error al buscar juego libre:', error);
        return of(null); // Devuelve un valor nulo si ocurre un error
      })
    );
  }
}
