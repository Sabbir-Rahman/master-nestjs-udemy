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

@Controller('/events')
export class EventsController {
  @Get()
  getEvents() {
    return [
      { id: 1, name: 'First event' },
      { id: 2, name: 'Second event' },
      { id: 3, name: 'Third event' },
    ]
  }

  @Get(':id')
  getEvent(@Param('id') id: number) {
    console.log(id)
    return { id: 1, name: 'First event' }
  }

  @Post()
  addEvent(@Body() input: CreateEventDto) {
    return input
  }

  @Patch(':id')
  updateEvent(@Param('id') id: number, @Body() input: UpdateEventDto) {
    console.log(input)
    return id
  }

  @Delete(':id')
  @HttpCode(204)
  removeEvent(@Param('id') id: number) {
    return id
  }
}
