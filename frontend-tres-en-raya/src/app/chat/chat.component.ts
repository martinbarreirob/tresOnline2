import { Component } from '@angular/core';
import { PlayerService } from '../player.service';
import { Player } from '../models/interfaces.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  isOpen = false;
  public player: Player | null = this.playerService.getCurrentPlayer();
  public opponent: Player | null = this.playerService.getCurrentOpponent();

  constructor(private playerService: PlayerService) {}

  toggleChat(): void {
    console.log(this.isOpen);

    this.isOpen = !this.isOpen;
  }
}
