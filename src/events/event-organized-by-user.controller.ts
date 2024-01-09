import {
  ClassSerializerInterceptor,
  Param,
  Query,
  UseInterceptors,
  Get,
  Controller,
} from '@nestjs/common'
import { EventService } from './events.service'

@Controller()
export class EventsOrganizedByUserController {
  constructor(private readonly eventsService: EventService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Param('userId') userId: number, @Query('page') page = 1) {
    return await this.eventsService.getEventsOrganizedByUserIdPaginated(
      userId,
      { currentPage: page, limit: 5 },
    )
  }
}
