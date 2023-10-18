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
  constructor (private http: HttpClient, private socketService: SocketService, private gameService: GameService){}

  private baseUrl: string = 'http://localhost:3000/';
  board: string[][] = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  player: any;
  playerId: number = 0;
  game: any;
  opponent: any;


  ngOnInit(): void{
    let playerLocalStorage = localStorage.getItem('player');
    if(playerLocalStorage){
      this.player = JSON.parse(playerLocalStorage);

    }
    this.http.get<Game>(`${this.baseUrl}game/playerGame/${this.player.id}`).subscribe((game)=>{
      this.game = game;
      this.board = JSON.parse(game.board);
    })

    this.socketService.listen('new-player').subscribe(newPlayer => {
      this.opponent = newPlayer;
    });
  }


  makeMove(row: number, col: number): void{
    switch(this.game.turn){
      case "X":
        if(this.game.playerXid === this.player.id){
          this.board[row][col] = "X"
          let boardString = JSON.stringify(this.board);

          this.updateBoard(boardString, 'O');
        }
        break;
      case "O":
        if(this.game.playerOid === this.player.id){
          this.board[row][col] = "O"
        }
        break;
      default:
        break;
    }
    this.game.turn === "X" ? "O" : "X"

  }

  updateBoard(board: string, turn: string){
    console.log('entrando update');

    const gameData = {
      board: board,
      turn: turn,
    }
    return this.http.put(`${this.baseUrl}game/${this.game.id}`, gameData);
  }


}
