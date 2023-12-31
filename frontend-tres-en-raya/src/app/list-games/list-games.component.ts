//list-games.component.ts
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SocketService } from '../socket.service'; // Asegúrate de importar tu servicio
import { HttpClient } from '@angular/common/http';
import { Player, Game } from '../models/interfaces.model';
import { Subscription, first } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { PlayerService } from '../player.service';


@Component({
  selector: 'app-list-games',
  templateUrl: './list-games.component.html',
  styleUrls: ['./list-games.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms', style({ opacity: 1 })),
      ]),
    ]),
  ]
})
export class ListGamesComponent implements OnInit, OnDestroy {
  @Output() emitEnterGame = new EventEmitter<void>();

  private disconnectionSubscription: Subscription = new Subscription();
  private baseUrl: string = 'http://localhost:3000/';

  games: Array<Game> = [];
  players: Array<Player> = [];
  user: any;
  userLogged: Player | undefined;

  constructor(private http: HttpClient, private socketService: SocketService, private playerService: PlayerService) { }

  ngOnInit(): void {
    this.user = this.playerService.getCurrentPlayer();

    this.getAllGamesAvaliable();
    this.setupSocketListeners();
  }

  ngOnDestroy(): void {

  }

  private setupSocketListeners(): void {
    //Escucha cuando se creó un juego
    this.socketService.listen<Game>('create-game').subscribe((newGame: Game) => {
      this.http.get<Player>(`${this.baseUrl}player/${newGame.playerXid}`).subscribe((namePlayer: Player) => {
        newGame.playerXname = namePlayer.nombre;
      })
      this.games.push(newGame as Game)
    });

    this.socketService.listen<Game>('list-games').subscribe((game: Game) => {
      this.games = this.games.filter(g => g.id !== game.id);
    });

    this.socketService.listen('clear-game').subscribe((data: any) => {
      const gameData = {
        status: 1,
      }
      this.http.put<Game>(`${this.baseUrl}game/${data}`, gameData).subscribe(()=>{
        this.getAllGamesAvaliable();
      });
    });

    this.socketService.listen('clear-own-game').subscribe((data: any) => {
      const gameData = {
        status: 1,
      }
      this.http.put<Game>(`${this.baseUrl}game/${data}`, gameData).subscribe((game: Game) => {
        this.games = this.games.filter(g => g.id !== game.id);
      })
    });
  }

  getAllGamesAvaliable(): void {
    this.http.get<Game[]>(`${this.baseUrl}game/allFreeGames`).subscribe((games: Game[]) => {
      this.games = games
      this.http.get<Player[]>(`${this.baseUrl}player/`).subscribe((players: Player[]) => {
        this.players = players;
        this.games.forEach(game => {
          game.playerXname = this.players.find(player => player.id === game.playerXid)?.nombre || 'Unknown';
        })
      })
    });
  }

  createGame(playerId: number) {
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
    this.http.post<Game>(`${this.baseUrl}game/`, gameData).subscribe((game: Game) => {
      this.socketService.emit('create-game', game);
      this.playerService.setCurrentGame(game.id);
      this.emitEnterGame.emit();
    });
  }

  joinGame(gameId: number, userId: number): void {
    const gameData = {
      status: 1,
      playerOid: this.user.id,
    }
    this.http.put<Game>(`${this.baseUrl}game/${gameId}`, gameData).subscribe((game: Game) => {
      this.socketService.emit('player-join-game', game);
      this.playerService.setCurrentGame(game.id);
      this.socketService.emit('list-games', game);

      this.emitEnterGame.emit();
    })
  };

  logout(): void {
    location.reload();

  }
}
