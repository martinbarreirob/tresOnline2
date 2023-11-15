//message.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, } from 'typeorm';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10000, nullable: true })
  text?: string | null;

  @Column('int')
  user: number;
}
