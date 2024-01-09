import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common'
import { AttendeeService } from './attendees.service'

@Controller('events/:eventId/attendees')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventAttendeesController {
  constructor(private readonly attendeesService: AttendeeService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Param('eventId') eventId: number) {
    return await this.attendeesService.findByEventId(eventId)
  }
}
