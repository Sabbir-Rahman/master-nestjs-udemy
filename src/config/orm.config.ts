import { registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { Profile } from 'src/auth/profile.entity'
import { User } from 'src/auth/user.entity'
import { Attendee } from 'src/events/attendee.entity'
import { Event } from 'src/events/event.entity'

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
  }),
)
