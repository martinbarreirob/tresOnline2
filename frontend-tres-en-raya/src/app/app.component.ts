import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-tres-en-raya';
  isRegistered: boolean = false;
  isOnGame: boolean = false;

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {

  }

  setRegistered() {
    this.isRegistered = true;
  }

  setEnterGame() {
    this.isOnGame = true;
  }
}
