import { registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Profile } from './../auth/profile.entity'
import { User } from './../auth/user.entity'
import { Attendee } from './../events/attendee.entity'
import { Event } from './../events/event.entity'

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    entities: [Event, Attendee, User, Profile],
    synchronize: true,
    dropSchema: Boolean(Number(process.env.DB_DROP_SCHEMA)),
  }),
)
