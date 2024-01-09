import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Event } from './event.entity'
import { EventsController } from './events.controller'
import { Attendee } from './attendee.entity'
import { EventService } from './events.service'
import { AttendeeService } from './attendees.service'
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller'
import { EventAttendeesController } from './event-attendees.controller'
import { EventsOrganizedByUserController } from './event-organized-by-user.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [
    EventsController,
    CurrentUserEventAttendanceController,
    EventAttendeesController,
    EventsOrganizedByUserController,
  ],
  providers: [EventService, AttendeeService],
})
export class EventsModule {}
