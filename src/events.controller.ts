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
    return { id: 1, name: 'First event' }
  }

  @Post()
  addEvent(@Body() input) {
    return input
  }

  @Patch(':id')
  updateEvent(@Param('id') id: number) {
    return id
  }

  @Delete(':id')
  @HttpCode(204)
  removeEvent(@Param('id') id: number) {
    return id
  }
}
