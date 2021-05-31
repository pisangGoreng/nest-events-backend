// entity === domain

import { Attendee } from "../attendee.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

// => event table name
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  when: Date;

  @Column()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    cascade: true
  })
  attendees: Attendee[];

}