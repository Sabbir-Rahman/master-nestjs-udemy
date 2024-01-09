import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Event } from './event.entity'
import { User } from 'src/auth/user.entity'

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected,
}

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
  @ManyToOne(() => Event, (event) => event.attendees, {
    nullable: false,
  })
  //   @JoinColumn({
  //     name:'event_id',
  //     referencedColumnName: 'secondary'
  //   })
  @JoinColumn()
  event: Event

  @Column()
  eventId: number

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted,
  })
  answer: AttendeeAnswerEnum

  @ManyToOne(() => User, (user) => user.attended)
  user: User

  @Column()
  userId: number
}
