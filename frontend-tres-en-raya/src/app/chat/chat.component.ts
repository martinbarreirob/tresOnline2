import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('chatMessages') private chatMessagesContainer: ElementRef;

  public isOpen = false;
  public player: Player | null = this.playerService.getCurrentPlayer();
  //public player: Player | null = { id: 1153, nombre: 'Martin', socketId: 0 };
  public opponent: Player | null = this.playerService.getCurrentOpponent();
  public messages: Message[] = [];
  private baseUrl: string = 'http://192.168.0.37:3000/';
  public colors = ["#1B1B1B", // Negro
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

  ngAfterViewInit(): void {
    this.getMessages();
    this.scrollToBottom();

    this.socketService.listen('messageEmited').subscribe((message: any) => {
      this.messages.push(message);
      this.scrollToBottom();
    });
  }

  private scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }












  ngOnInit(): void {

  }

  toggleChat(): void {
    console.log(this.isOpen);

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
    const message: Message = {
      text: this.stringMessage,
      userId: this.player!.id,
      userName: this.player!.nombre,
    }

    this.http.post<Message>(`${this.baseUrl}message/`, message).subscribe((message: Message) => {
      this.messages.push(message);
      this.socketService.emit('messageEmited', message);
    })

    this.stringMessage = ""
  }

}
