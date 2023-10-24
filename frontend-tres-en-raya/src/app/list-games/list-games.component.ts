//list-games.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { SocketService } from '../socket.service'; // Asegúrate de importar tu servicio
import { HttpClient } from '@angular/common/http';
import { Player, Game } from '../models/interfaces.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-games',
  templateUrl: './list-games.component.html',
  styleUrls: ['./list-games.component.css']
})
export class ListGamesComponent implements OnInit, OnDestroy {
  private disconnectionSubscription: Subscription= new Subscription();
  private baseUrl: string = 'http://192.168.0.42:3000/';

  games: Array<Game> = [];
  players: Array<Player> = [];


  constructor (private http: HttpClient, private socketService: SocketService){}

  ngOnInit(): void{
    this.http.get<Game[]>(`${this.baseUrl}game/allFreeGames`).subscribe((games: Game[]) => {
      this.games = games
      this.http.get<Player[]>(`${this.baseUrl}player/`).subscribe((players: Player[])=>{
        this.players = players;
        console.log(players);
        this.games.forEach(game => {
          game.playerXname = this.players.find(player => player.id === game.playerXid)?.nombre || 'Unknown';
        })
      })
    });
  }

  ngOnDestroy(): void{

  }

  getRandomEmoji(): string {
    const emojis = ["🎯", "😀", "🎉", "❤️", "🐱", "🍕", "🚀", "🌙", "🍀", "🎈"];
    const randomIndex = Math.floor(Math.random() * emojis.length);
    return emojis[randomIndex];
  }
}


