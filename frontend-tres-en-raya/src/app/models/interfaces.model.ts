export interface Game {
  id: number;
  board: string;
  status: number;
  playerXid: number;
  playerOid: number;
  turn: 'X' | 'O';
  playerXname?: string;
}

export interface Player {
  id: number;
  nombre: string;
  roomId?: number;

}

export interface Message {
  id?: number;
  text: string;
  userId: number;
  color?: string;
  userName?: string;
  date?: Date;
  time?: string;
  roomId?: number;
}
