import { Event } from './events/event.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: false
  })
  @JoinColumn()
  event: Event;
}