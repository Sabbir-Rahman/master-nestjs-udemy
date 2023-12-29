import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
} from '@nestjs/common'
import { CreateEventDto } from './create-event.dto'
import { UpdateEventDto } from './update-event.dto'
import { Event } from './event.entity'

@Controller('/events')
export class EventsController {
  private events: Event[] = []

  @Get()
  getEvents() {
    return this.events
  }

  @Get(':id')
  getEvent(@Param('id') id) {
    return this.events.find((event) => event.id === parseInt(id))
  }

  @Post()
  addEvent(@Body() input: CreateEventDto) {
    const newEvent: Event = {
      ...input,
      when: new Date(input.when),
      id: this.events.length + 1,
    }
    this.events.push(newEvent)
    return newEvent
  }

  @Patch(':id')
  updateEvent(@Param('id') id, @Body() input: UpdateEventDto) {
    const index = this.events.findIndex((event) => event.id === parseInt(id))
    this.events[index] = {
      ...this.events[index],
      ...input,
      when: input.when ? new Date(input.when) : this.events[index].when,
    }
    return this.events[index]
  }

  @Delete(':id')
  @HttpCode(204)
  removeEvent(@Param('id') id) {
    this.events = this.events.filter((event) => event.id !== parseInt(id))
  }
}
