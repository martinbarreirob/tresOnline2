//player.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, } from 'typeorm';

@Entity('player')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre?: string | null;


}
