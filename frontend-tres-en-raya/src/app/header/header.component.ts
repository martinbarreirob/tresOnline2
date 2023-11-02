import { Component, EventEmitter, Output, } from '@angular/core';
import { Player } from '../models/interfaces.model';
import { PlayerService } from '../player.service';
import { SocketService } from '../socket.service'; // Asegúrate de importar tu servicio

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() emitLogout = new EventEmitter<void>();
  player: Player | null = this.playerService.getCurrentPlayer();

  constructor(private playerService: PlayerService,  private socketService: SocketService) {}

  logoutButton(): void {
    this.emitLogout.emit();
    this.socketService.emit('clear-own-game', "")
  }
}
