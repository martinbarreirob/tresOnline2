//game.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../socket.service'; // Asegúrate de importar tu servicio
import { HttpClient } from '@angular/common/http';
import { Player, Game } from '../models/interfaces.model';
import { Observable, Subscription, first } from 'rxjs';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  private disconnectionSubscription: Subscription = new Subscription();
  private baseUrl: string = 'http://192.168.0.42:3000/';

  board: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  player: Player | null = null;
  user: any = "";
  game: any = {};
  opponent: any;
  playingFor: any;
  gameOver: boolean = false;
  winner: string | null = null;
  mensajesResultado: Array<string> = ['YOU WIN', 'YOU LOSE', 'DRAW']
  resultado: string = "";
  playerReadyRestart: boolean = false;
  opponentReadyRestart: boolean = false;
  opponentDisconnected: boolean = false;


  constructor(private http: HttpClient, private socketService: SocketService, private playerService: PlayerService) {
    this.playerReadyRestart = false;
    this.opponentReadyRestart = false;
  }

  ngOnInit(): void {
    this.setupSocketListeners();
  }

  ngOnDestroy(): void {
    this.disconnectionSubscription.unsubscribe();
  }

  //#######################################################################

  private setupSocketListeners(): void {

    this.socketService.listen<Game>('create-game').pipe(first()).subscribe((game: Game) => {
      this.http.get<Game>(`${this.baseUrl}game/${game.id}`).subscribe((game: Game) => {
        this.game = game;
        this.setUpPlayer();
      });
    });


    this.socketService.listen<Game>('player-join-game').subscribe((game: Game) => {
      //Si no está establecido player. Salta si el componente no viene del listen create-game
      if (this.player === null) {
        this.http.get<Game>(`${this.baseUrl}game/${game.id}`).subscribe((game: Game) => {
          this.game = game;
          //Carga la variable player con el localstorage
          this.setUpPlayer();
          //Carga en el oponente el playerX
          this.selectOneUser(game.playerXid).subscribe((opponent: Player) => {
            this.opponent = opponent;
          });
        });
      } else {
        this.selectOneUser(game.playerOid).subscribe((opponent: Player) => {
          this.opponent = opponent;
        });
      }
    });

    this.socketService.listen<Game>('updated-game').subscribe((game: Game) => {
      this.game = game;
      this.board = JSON.parse(this.game.board);

      //Comprobación de si ha habido un ganador
      this.winner = this.checkWinner();
      if (this.winner) {
        this.updateWinner(this.winner);
      }
    });

    //Cuando alguien gana recibe el evento para actualizar mesa y contadores
    this.socketService.listen<Game>('updated-winner-game').subscribe((game: Game) => {
      this.game = game;
      this.resultado = this.winnerMessage(this.winner);
    });

    this.socketService.listen<Game>('ready-restart-game').subscribe((game: Game) => {
      this.opponentReadyRestart = true;

      if (this.playerReadyRestart && this.opponentReadyRestart === true) {
        this.socketService.emit('restart-game', game);
      }
    });

    this.socketService.listen<Game>('restart-game').subscribe((game: Game) => {
      console.log('restart');

      this.restartGame();
    });
  }

  setUpPlayer(): void {
    this.player = this.playerService.getCurrentPlayer();
    this.playingFor = this.game.playerXid === this.player?.id ? 'X' : 'O';
  }

  winnerMessage(winner: string | null): string {
    if (winner === null) {
      return this.mensajesResultado[2];
    }
    if (winner === this.playingFor) {
      return this.mensajesResultado[0];
    } else {
      return this.mensajesResultado[1];
    }
  }

  selectOneUser(playerId: number): Observable<Player> {
    return this.http.get<Player>(`${this.baseUrl}player/${playerId}`);
  }

  makeMove(row: number, col: number): void {
    //Compruebo si hay oponente
    if (!this.opponent) {
      return;
    }
    //Compruebo si el juego está terminado
    if (this.gameOver) {
      return;
    }
    //Compruebo si la celda está vacia
    if (this.board[row][col] !== '') {
      return;
    }
    //Compruebo si es mi turno sindo X.
    if (this.game.turn !== this.playingFor) {
      return;
    }
    //Rellena la posicion en la tabla con nuestra ficha.
    this.board[row][col] = this.playingFor;

    //Actualización del tablero
    let boardString = JSON.stringify(this.board);
    let nextTurn = this.game.turn === 'X' ? 'O' : 'X';
    this.updateBoard(boardString, nextTurn);
  }

  checkWinner(): string | null {
    // Comprobar filas, columnas y diagonales
    const winningCombinations = [
      // Filas
      [this.board[0][0], this.board[0][1], this.board[0][2]],
      [this.board[1][0], this.board[1][1], this.board[1][2]],
      [this.board[2][0], this.board[2][1], this.board[2][2]],
      // Columnas
      [this.board[0][0], this.board[1][0], this.board[2][0]],
      [this.board[0][1], this.board[1][1], this.board[2][1]],
      [this.board[0][2], this.board[1][2], this.board[2][2]],
      // Diagonales
      [this.board[0][0], this.board[1][1], this.board[2][2]],
      [this.board[0][2], this.board[1][1], this.board[2][0]]
    ];

    for (let combination of winningCombinations) {
      if (combination[0] && combination[0] === combination[1] && combination[1] === combination[2]) {
        this.gameOver = true;
        return combination[0]
      }
    }

    // Comprobar empate
    const isDraw = this.board.flat().every(cell => cell !== '');
    if (isDraw) {
      this.gameOver = true;
    }

    return null;
  }

  updateWinner(winner: string): void {
    let gameData: any;

    if (winner === 'X') {
      gameData = {
        winX: ++this.game.winX
      }
    } else if (winner === 'O') {
      gameData = {
        winO: ++this.game.winO
      }
    }

    this.http.put<Game>(`${this.baseUrl}game/${this.game.id}`, gameData).subscribe((game) => {
      this.socketService.emit('updated-winner-game', game);
    });
  }

  updateBoard(board: string, turn: string) {
    const gameData = {
      board: board,
      turn: turn,
    }

    this.http.put<Game>(`${this.baseUrl}game/${this.game.id}`, gameData).subscribe(
      updateGame => {
        this.socketService.emit("updated-game", updateGame);
      },
      error => {
        console.error('Error al actualizar el juego:', error);
      }
    );
  }

  emitRestartGame() {
    this.playerReadyRestart = true;

    this.socketService.emit('ready-restart-game', this.game)
  }

  restartGame() {
    let tableroLimpio = [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ];
    let turno = Math.random() < 0.5 ? 'X' : 'O';

    this.gameOver = false;
    this.winner = null;
    this.playerReadyRestart = false;
    this.opponentReadyRestart = false;

    this.updateBoard(JSON.stringify(tableroLimpio), turno);
  }

  reloadPage(): void {
    window.location.reload();
  }
}


