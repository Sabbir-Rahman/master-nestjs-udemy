import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Attendee } from './attendee.entity'
import { User } from './../auth/user.entity'
import { PaginationResult } from './../pagination/paginator'

@Entity()
export class Event {
  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial)
  }
  @PrimaryGeneratedColumn('uuid')
  id: number

  @Column()
  name: string
  @Column()
  description: string
  @Column()
  when: Date
  @Column()
  address: string
  @OneToMany(() => Attendee, (attendee) => attendee.event)
  attendees: Attendee[]

  @ManyToOne(() => User, (user) => user.organized)
  organizer: User

  @Column({ nullable: true })
  organizerId: number

  // This is a virtual column
  attendeeCount?: number
  attendeeRejected?: number
  attendeeMaybe?: number
  attendeeAccepted?: number
}

export type PaginatedEvents = PaginationResult<Event>
