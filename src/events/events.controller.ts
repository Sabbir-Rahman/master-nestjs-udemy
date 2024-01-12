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
  ForbiddenException,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { CreateEventDto } from './input/create-event.dto'
import { UpdateEventDto } from './input/update-event.dto'
import { Event } from './event.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Attendee } from './attendee.entity'
import { EventService } from './events.service'
import { ListEvents } from './list.events'
import { CurrentUser } from './../auth/current-user.decorator'
import { User } from './../auth/user.entity'
import { AuthGuardJwt } from './../auth/auth-guard.jwt'

@Controller('/events')
// By 'excludeAll; Only add @Expose() in event entity will give the response result
// @SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name)
  private events: Event[] = []
  constructor(
    @InjectRepository(Attendee)
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
    // return await this.repository.find({
    //   select: ['id', 'when'],
    //   where: [
    //     { id: MoreThan(3), when: MoreThan(new Date('2021-02-12T13:00:00')) },
    //     { description: Like('%meet%') },
    //   ],
    //   take: 2,
    //   order: {
    //     id: 'DESC',
    //   },
    // })
  }

  // @Get('/practice2')
  // async practice2() {
  //   // return await this.repository.find({
  //   //   where: { id: 1 },
  //   //   relations: ['attendees'],
  //   // })
  //   const event = new Event()
  //   event.id = 1

  //   const attendee = new Attendee()
  //   attendee.name = 'Jerry'
  //   attendee.event = event

  //   await this.attendeeRepository.save(attendee)

  //   return event
  // }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // const event = await this.repository.findOneBy({ id })
    const event = await this.eventService.getEventWithAttendeeCount(id)
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
  @UseGuards(AuthGuardJwt)
  async update(
    @Param('id') id,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventService.findOne(id)

    if (!event) {
      throw new NotFoundException()
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        `You are not authorized to change this event`,
      )
    }
    return await this.eventService.updateEvent(event, input)
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(@Param('id') id, @CurrentUser() user: User) {
    const event = await this.eventService.findOne(id)
    if (!event) {
      throw new NotFoundException()
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(
        null,
        `You are not authorized to delete this event`,
      )
    }

    return await this.eventService.deleteEvent(id)
  }
}
