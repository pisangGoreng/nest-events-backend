// ! factory pattern

import { registerAs } from "@nestjs/config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm"
import { Attendee } from "src/attendee.entity";
import { Event } from '../events/event.entity';

export default registerAs(
  'orm_config',
  (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Event, Attendee], // array of table name
    synchronize: false
    /*
      will auto create table, after define entities.
      it will auto update toolbar, after schema is change
    */
  })
);