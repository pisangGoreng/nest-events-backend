import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from '../attendee.entity';
import { Event } from './event.entity';
import { EventsController } from './events.controller';

// Custom module with specific tools
// nest generate module events
@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Attendee]),
  ],
  controllers: [EventsController]
})
export class EventsModule { }
