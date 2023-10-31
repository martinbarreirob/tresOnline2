import { Component, EventEmitter, Output, } from '@angular/core';
import { Player } from '../models/interfaces.model';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() buttonLogout = new EventEmitter<void>();
  player: Player | null = this.playerService.getCurrentPlayer();

  constructor(private playerService: PlayerService) {}

  logoutButton(): void {
    this.buttonLogout.emit();
    console.log('proba');
  }
}
