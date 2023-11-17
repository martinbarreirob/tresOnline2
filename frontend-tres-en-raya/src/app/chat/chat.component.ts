import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { PlayerService } from '../player.service';
import { Player } from '../models/interfaces.model';
import { Message } from '../models/interfaces.model';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, AfterViewChecked {

  public isOpen = false;
  public player: Player | null = this.playerService.getCurrentPlayer();
  //public player: Player | null = { id: 1153, nombre: 'Martin', socketId: 0 };
  public opponent: Player | null = this.playerService.getCurrentOpponent();
  public messages: Message[] = [];
  private baseUrl: string = 'http://192.168.0.37:3000/';
  public colors = [
    "#1B1B1B", // Negro
    "#0057B8", // Azul
    "#008000", // Verde
    "#FFD700", // Dorado
    "#FF8C00", // Naranja oscuro
    "#D22B2B", // Rojo
    "#551A8B", // Púrpura
    "#008B8B", // Cyan oscuro
    "#A52A2A", // Marrón
    "#A52A2A", // Marrón
    "#2E8B57"
  ];
  public stringMessage: string = "";


  constructor(private http: HttpClient, private socketService: SocketService, private playerService: PlayerService,) { }


  ngAfterViewChecked() {
    let d = document.querySelector('.chat-messages');
    if (d) {
      d.scrollTop = d.scrollHeight;
    }
  }

  ngOnInit(): void {
    this.getMessages();
    this.socketListeners()
  }

  socketListeners(): void {
    this.socketService.listen('player-join-room').subscribe((data: any) => {
      console.log('player-join', data);
    });

    this.socketService.listen('messageEmited').subscribe((message: any) => {
      this.messages.push(message);
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  getRandomColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  getPlayerName(id: number): string | undefined {
    this.http.get<Player>(`${this.baseUrl}player/${id}`).subscribe((player: Player) => {
      console.log(player.nombre);

      return player.nombre
    });
    return
  }

  getMessages() {
    this.http.get<Message[]>(`${this.baseUrl}message`).subscribe((messages: Message[]) => {

      this.messages = messages.map(message => ({
        ...message,
        color: this.getRandomColor(),
        userName: message.userName,
      }));

    });
  }

  sendMessage(): void {
    const data = new Date();
    const formattedTime = `${data.getHours()}:${data.getMinutes().toString().padStart(2, '0')}`;

    const message: Message = {
      text: this.stringMessage,
      userId: this.player!.id,
      userName: this.player!.nombre,
      date: data,
      time: formattedTime,
    }

    this.http.post<Message>(`${this.baseUrl}message/`, message).subscribe((message: Message) => {
      this.messages.push(message);
      this.socketService.emit('messageEmited', message);
    })

    this.stringMessage = ""
  }

}
