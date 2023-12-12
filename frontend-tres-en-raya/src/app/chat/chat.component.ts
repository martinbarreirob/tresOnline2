import { AfterViewChecked, Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { PlayerService } from '../player.service';
import { Game, Player } from '../models/interfaces.model';
import { Message } from '../models/interfaces.model';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit, AfterViewChecked {
  //public player: Player | null = { id: 1153, nombre: 'Martin' };
  private baseUrl: string = 'http://192.168.0.37:3000/';
  public isOpen: boolean = false;
  public player: Player | null = this.playerService.getCurrentPlayer();
  public opponent: Player | null = this.playerService.getCurrentOpponent();
  public messages: Message[] = [];
  public groupedMessages: any[] = [];
  public stringMessage: string = "";


  @HostListener('document:click', ['$event'])
  clickout(event: any): void {
    event.stopPropagation();
    if (this.isOpen === true && !this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  @HostListener('click', ['$event'])
  clickin(event: any): void {
    event.stopPropagation();

    if (this.isOpen === false) {
      this.isOpen = true;
    }
  }


  constructor(private http: HttpClient, private socketService: SocketService, private playerService: PlayerService, private eRef: ElementRef) { }

  ngOnInit(): void {
    this.socketListeners();
    this.joinChat();
    this.getMessages();
  }

  ngAfterViewChecked() {
    let d = document.querySelector('.chat-messages');
    if (d) {
      d.scrollTop = d.scrollHeight;
    }
  }

  socketListeners(): void {
    this.socketService.listen('player-join-chat').subscribe((data: any) => {
      this.opponent = this.playerService.getCurrentOpponent();
      console.log('player-join-chat');
    });

    this.socketService.listen('messageEmited').subscribe((message: any) => {
      this.messages.push(message);
      this.groupedMessages = this.groupByDate(this.messages);
    });
  }

  //Pruebo a lanzar un evento en el inico de componente para subcribirme al listner de player-join-room para notificar al otro usuario cuando se une alguien a la sala.
  joinChat(): void{
    console.log();

    this.http.get<Game>(`${this.baseUrl}game/${this.player!.roomId}`).subscribe((game: Game) => {
      this.socketService.emit('player-join-chat', game);
      console.log('joinChat');
    });
  }

  toggleChat(event: Event): void {
    this.isOpen = false;
    event.stopPropagation()
  }

  getPlayerName(id: number): string | undefined {
    this.http.get<Player>(`${this.baseUrl}player/${id}`).subscribe((player: Player) => {
      console.log(player.nombre);

      return player.nombre
    });
    return
  }


  sendMessage(): void {
    if (this.stringMessage === "") {
      return;
    }
    const data = new Date();
    const formattedTime = `${data.getHours()}:${data.getMinutes().toString().padStart(2, '0')}`;

    const message: Message = {
      text: this.stringMessage,
      userId: this.player!.id,
      userName: this.player!.nombre,
      date: data,
      time: formattedTime,
      roomId: this.player!.roomId,
    }

    this.http.post<Message>(`${this.baseUrl}message/`, message).subscribe((message: Message) => {
      this.messages.push(message);
      //emito el mensaje
      this.groupedMessages = this.groupByDate(this.messages);
      this.socketService.emit('messageEmited', message);
    })

    this.stringMessage = ""
  }


  getMessages(): any {
    this.http.get<Message[]>(`${this.baseUrl}message/${this.player!.roomId}`).subscribe((messages: Message[]) => {
    //this.http.get<Message[]>(`${this.baseUrl}message`).subscribe((messages: Message[]) => {
      this.messages = messages.map(message => ({
        ...message,
        userName: message.userName,
      }));

      this.groupedMessages = this.groupByDate(this.messages);
    });
  }


  groupByDate(messages: Message[]) {
    // Función para formatear la fecha en un formato legible (ej: '2023-03-15')
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    };

    // Reductor para agrupar mensajes por fecha
    const customReducer = (accumulator: any, currentMessage: any) => {
      // Extraemos la fecha del mensaje y la formateamos
      const dateKey = formatDate(currentMessage.date);

      // Si no existe un grupo para esta fecha, lo creamos
      if (!accumulator[dateKey]) {
        accumulator[dateKey] = [];
      }

      // Agregamos el mensaje al grupo correspondiente
      accumulator[dateKey].push(currentMessage);
      return accumulator;
    };

    // Usamos reduce para agrupar los mensajes
    const groupedMessages = messages.reduce(customReducer, {});

    return groupedMessages;
  }
}
