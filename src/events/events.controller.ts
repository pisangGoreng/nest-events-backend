import { Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, Patch, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Event } from "./event.entity";
import { UpdateEventDto } from "./input/update-event.dto";
import { CreateEventDto } from "./input/create-event.dto";
import { Attendee } from "../attendee.entity";
import { EventsService } from "./events.service";
import { ListEvents } from "./input/list.events";

@Controller('/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name)

  constructor(
    @InjectRepository(Event) // always use entitites / domain name when use dependency injection for repositories
    private readonly repository: Repository<Event>,

    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,

    private readonly eventsService: EventsService
  ) {

  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() filter: ListEvents) {
    const events = await this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
      filter, {
        total: true,
        currentPage: filter.page,
        limit: 10
      })
    return events
  }

  @Get('/practice2')
  async practice2() {
    const event = await this.repository.findOne(1, {
      relations: ['attendees']
    })

    const attendee = new Attendee()
    attendee.name = 'using cascade'
    event.attendees.push(attendee)

    await this.repository.save(event)

    return event
  }


  @Get(':id')
  async findOne(@Param('id') id) {
    const event = await this.eventsService.getEvent(id)

    if(!event) {
      throw new NotFoundException();
    }
    return event;
  }

  @Post()
  async create(@Body() input: CreateEventDto) {
    /*
        input: CreateEventDto, we expect input will have data types like CreateEventDto
        ! DTO only specified for property name & value type and class-validator for custom validation
    */
    return await this.repository.save({
      ...input,
      when: new Date(input.when),
    })
  }

  @Patch(':id') // only update specific property object
  // @Put(':id') // update all property object, similar like POST
  async update(
    @Param('id') id,
    @Body() input: UpdateEventDto) {
    const event = await this.repository.findOne(id);


    return this.repository.save({
      ...event,
      ...input,
      when: input.when ? new Date(input.when) : event.when
    })
  }

  @Delete(':id')
  @HttpCode(204) // specially when delete, return status 204 / No Content
  async remove(@Param('id') id) {
    const result = await this.eventsService.deleteEvent(id)

    if (result?.affected !== 1) {
      throw new NotFoundException()
    }
  }
}