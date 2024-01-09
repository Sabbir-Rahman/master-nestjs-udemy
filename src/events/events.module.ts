import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Event } from './event.entity'
import { EventsController } from './events.controller'
import { Attendee } from './attendee.entity'
import { EventService } from './events.service'
import { AttendeeService } from './attendees.service'

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [EventsController],
  providers: [EventService, AttendeeService],
})
export class EventsModule {}
