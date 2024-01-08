import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseIntPipe,
  Logger,
  NotFoundException,
  Query,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common'
import { CreateEventDto } from './input/create-event.dto'
import { UpdateEventDto } from './input/update-event.dto'
import { Event } from './event.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Like, MoreThan, Repository } from 'typeorm'
import { Attendee } from './attendee.entity'
import { EventService } from './events.service'
import { ListEvents } from './list.events'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { User } from 'src/auth/user.entity'
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt'

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name)
  private events: Event[] = []
  constructor(
    @InjectRepository(Event)
    private readonly repository: Repository<Event>,
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
    private readonly eventService: EventService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    this.logger.log('Hit the find all route')
    const events =
      await this.eventService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        { total: true, currentPage: filter.page, limit: 2 },
      )

    return events
  }

  @Get('/practice')
  async practice() {
    return await this.repository.find({
      select: ['id', 'when'],
      where: [
        { id: MoreThan(3), when: MoreThan(new Date('2021-02-12T13:00:00')) },
        { description: Like('%meet%') },
      ],
      take: 2,
      order: {
        id: 'DESC',
      },
    })
  }

  @Get('/practice2')
  async practice2() {
    // return await this.repository.find({
    //   where: { id: 1 },
    //   relations: ['attendees'],
    // })
    const event = new Event()
    event.id = 1

    const attendee = new Attendee()
    attendee.name = 'Jerry'
    attendee.event = event

    await this.attendeeRepository.save(attendee)

    return event
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // const event = await this.repository.findOneBy({ id })
    const event = await this.eventService.getEvent(id)
    if (!event) {
      throw new NotFoundException()
    }
    return event
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return this.eventService.createEvent(input, user)
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() input: UpdateEventDto) {
    const event = await this.repository.findOneBy({ id })

    return await this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when,
    })
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id) {
    const result = await this.eventService.deleteEvent(id)

    if (result?.affected === 0) {
      throw new NotFoundException()
    }
  }
}
