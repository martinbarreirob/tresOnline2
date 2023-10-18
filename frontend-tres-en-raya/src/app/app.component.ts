import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-tres-en-raya';
  isRegistered = false;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    // Escuchar movimientos de otros jugadores
    this.socketService.listenForMoves().subscribe((moveData: string) => {
      console.log('Movimiento recibido:', moveData);
      // Aquí puedes actualizar tu tablero o realizar cualquier otra acción necesaria
    });
  }

  setRegistered() {
    console.log('registro')
    this.isRegistered = true;
  }

  // Suponiendo que tienes una función para manejar el movimiento del jugador
  handlePlayerMove(moveData: string): void {
    // Aquí puedes manejar el movimiento en tu frontend
    // ...

    // Luego, emites el movimiento al servidor
    this.socketService.emitMove(moveData);
  }
}
