// game.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('game')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 200 })
  board: string;

  @Column('tinyint', { width: 1, default: 0 })
  status: number;

  @Column('int')
  playerXid: number;

  @Column('int')
  playerOid: number;

  @Column({
    type: 'enum',
    enum: ['X', 'O'],
  })
  turn: 'X' | 'O';

  @Column('int')
  winX: number;

  @Column('int')
  winO: number;
}
