import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-tres-en-raya';
  isRegistered = false; //CAMBIAR A FALSE

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {

  }

  setRegistered() {
    this.isRegistered = true;
  }
}
