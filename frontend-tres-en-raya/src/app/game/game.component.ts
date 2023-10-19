//game.component.ts

import { Component, OnInit } from '@angular/core';
import { SocketService } from '../socket.service'; // Asegúrate de importar tu servicio
import { HttpClient } from '@angular/common/http';
import { Player, Game } from '../models/interfaces.model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  private baseUrl: string = 'http://localhost:3000/';
  board: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  player: any;
  game: any;
  opponent: any;
  currentPlayer: any;
  gameOver: boolean = false;

  constructor (private http: HttpClient, private socketService: SocketService){}

  ngOnInit(): void{
    let playerLocalStorage = localStorage.getItem('player');
    if(playerLocalStorage){
      this.player = JSON.parse(playerLocalStorage);
    }

    // Carga el juego en funcion del usuario que se acaba de registrar con el local storage
    this.http.get<Game>(`${this.baseUrl}game/playerGame/${this.player.id}`).subscribe((game)=>{
      this.game = game;
      this.board = JSON.parse(game.board);

      //Comprobar si Somos X o O
      if (this.game.playerXid === this.player.id) {
        this.currentPlayer = 'X';

      } else if (this.game.playerOid === this.player.id) {
        this.currentPlayer = 'O';

        this.http.get<Player>(`${this.baseUrl}player/${this.game.playerXid}`).subscribe((playerX) => {
          this.opponent = playerX;
       });

      }
    })

    this.socketService.listen('player-connected').subscribe(newPlayer => {
      this.opponent = newPlayer;
    });

    this.socketService.listen('game-updated').subscribe(game => {
      this.game = game;
      this.board = JSON.parse(this.game.board);
      this.checkWinner();
    });



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

    //Compruebo si es mi turno sindo X
    if (this.game.turn === 'O' && this.game.playerXid === this.player.id) {
      return;
    }

    //Compruebo si es mi turno sindo O
    if (this.game.turn === 'X' && this.game.playerOid === this.player.id) {
      return;
    }

    if (this.game.turn === 'X' && this.game.playerXid === this.player.id) {
        this.board[row][col] = 'X';
    }
    else if (this.game.turn === 'O' && this.game.playerOid === this.player.id) {
        this.board[row][col] = 'O';
    }

    //Actualización del tablero
    let boardString = JSON.stringify(this.board);
    let nextTurn = this.game.turn === 'X' ? 'O' : 'X';
    this.updateBoard(boardString, nextTurn);

    this.checkWinner();
}





  updateBoard(board: string, turn: string) {
    const gameData = {
        board: board,
        turn: turn,
    }

    this.http.put<Game>(`${this.baseUrl}game/${this.game.id}`, gameData).subscribe(
        updateGame => {
            this.socketService.emit("game-updated", updateGame);
            this.checkWinner();

        },
        error => {
            console.error('Error al actualizar el juego:', error);
        }
    );
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
            return combination[0]; // Retorna 'X' o 'O' según el ganador
        }
    }

    // Comprobar empate: si no hay ninguna celda vacía y no hay ganador
    const isDraw = this.board.flat().every(cell => cell !== '');
    if (isDraw) {
        this.gameOver = true;
        return 'Draw';
    }

    return null; // No hay ganador ni empate aún
  }

  restartGame(){
    this.gameOver = false;

    const gameData = {
      board: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
      ],
      turn: "",
  }

    this.http.put<Game>(`${this.baseUrl}game/${this.game.id}`, gameData).subscribe(
      updateGame => {
          this.socketService.emit("game-updated", updateGame);
          this.checkWinner();

      },
      error => {
          console.error('Error al actualizar el juego:', error);
      }
  );
  }




}
