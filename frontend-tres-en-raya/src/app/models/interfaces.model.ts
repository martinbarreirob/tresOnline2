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
  socketId: number
}

