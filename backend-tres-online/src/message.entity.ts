//message.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, } from 'typeorm';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column('int')
  userId: number;
  
  @Column('int')
  roomId?: number | null;
  
  @Column({ type: 'varchar', length: 10000})
  text?: string | null;

  @Column('varchar')
  userName?: string | null;

  @Column('timestamp')
  date?: Date | null;

  @Column('varchar')
  time?: string | null;


}
