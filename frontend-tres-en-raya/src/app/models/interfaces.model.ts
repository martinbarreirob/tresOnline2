export interface Game {
  id: number;
  board: string;
  status: number;
  playerXid: number;
  playerOid: number;
  turn: 'X' | 'O';
}

export interface Player {
  id: number;
  nombre: string;
}

