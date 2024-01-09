import { AttendeeService } from './attendees.service'
import { EventService } from './events.service'
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { CreateAttendeeDto } from './input/create-attendee.dto'
import { CurrentUser } from 'src/auth/current-user.decorator'
import { User } from 'src/auth/user.entity'
import { AuthGuardJwt } from 'src/auth/auth-guard.jwt'

@Controller()
@UseGuards(AuthGuardJwt)
@UseInterceptors(ClassSerializerInterceptor)
export class CurrentUserEventAttendanceController {
  constructor(
    private readonly eventsService: EventService,
    private readonly attendeesService: AttendeeService,
  ) {}

  @Get()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@CurrentUser() user: User, @Query('page') page = 1) {
    return await this.eventsService.getEventsOrganizedByUserIdPaginated(
      user.id,
      { limit: 6, currentPage: page },
    )
  }

  @Get(':/eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    const attendee = await this.attendeesService.findOndByEventIdAndUserId(
      eventId,
      user.id,
    )

    if (!attendee) {
      throw new NotFoundException()
    }

    return attendee
  }

  @Put('/:eventId')
  @UseGuards(AuthGuardJwt)
  async createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() input: CreateAttendeeDto,
    @CurrentUser() user: User,
  ) {
    return this.attendeesService.createOrUpdate(input, eventId, user.id)
  }
}
