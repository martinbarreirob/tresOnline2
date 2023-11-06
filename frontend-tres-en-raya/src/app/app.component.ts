import { Component, OnInit } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-tres-en-raya';
  isRegistered: boolean = true; //CAMBIAR A FALSE
  isOnGame: boolean = true;

  constructor(private socketService: SocketService) { }

  ngOnInit(): void {
    this.socketService.listen('player-disconnected').subscribe((data: any)=>{
    })
  }

  setRegistered() {
    this.isRegistered = true;
  }

  setEnterGame() {
    if(this.isOnGame === false){
      this.isOnGame = true;
    }else{
      this.isOnGame = false
    }
  }

  logout(){
    console.log('logout app.ts');

    if(this.isOnGame === true){
      this.isOnGame = false;
    }
  }
}
