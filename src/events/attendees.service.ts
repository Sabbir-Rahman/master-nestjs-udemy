import { InjectRepository } from '@nestjs/typeorm'
import { Attendee } from './attendee.entity'
import { Repository } from 'typeorm'
import { CreateAttendeeDto } from './input/create-attendee.dto'

export class AttendeeService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  public async findByEventId(eventId: number): Promise<Attendee[]> {
    return await this.attendeeRepository.findBy({
      event: { id: eventId },
    })
  }

  public async findOndByEventIdAndUserId(
    eventId: number,
    userId: number,
  ): Promise<Attendee | undefined> {
    return await this.attendeeRepository.findOneBy({
      event: { id: eventId },
      user: { id: userId },
    })
  }

  public async createOrUpdate(
    input: CreateAttendeeDto,
    eventId: number,
    userId: number,
  ): Promise<Attendee> {
    const attendee =
      (await this.findOndByEventIdAndUserId(eventId, userId)) ?? new Attendee()

    attendee.eventId = eventId
    attendee.userId = userId
    attendee.answer = input.answer

    return await this.attendeeRepository.save(attendee)
  }
}
