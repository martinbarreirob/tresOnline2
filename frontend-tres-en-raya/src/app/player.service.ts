// player.service.ts
import { Injectable } from '@angular/core';
import { Player } from './models/interfaces.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private currentPlayer: Player | null = null;

  setCurrentPlayer(player: Player): void {
    this.currentPlayer = player;
  }

  getCurrentPlayer(): Player | null {
    return this.currentPlayer;
  }
}
