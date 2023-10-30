import { Component, Input } from '@angular/core';
import { Player } from '../models/interfaces.model';
import { PlayerService } from '../player.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  player: Player | null = this.playerService.getCurrentPlayer();

  constructor(private playerService: PlayerService) {}

  logoutButton(): void {
    console.log('proba');

    location.reload();
  }

  @Input() userLogged: Player | undefined;
}
