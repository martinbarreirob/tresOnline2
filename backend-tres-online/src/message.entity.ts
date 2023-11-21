//message.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, } from 'typeorm';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10000, nullable: true })
  text?: string | null;

  @Column('int')
  userId: number;

  @Column('int')
  sala?: number | null;

  @Column('varchar')
  userName?: string | null;

  @Column('timestamp')
  date?: Date | null;

  @Column('varchar')
  time?: string | null;

  @Column('int')
  roomId?: number | null;
}
