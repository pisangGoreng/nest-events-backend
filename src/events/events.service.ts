import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AttendeeAnswerEnum } from "src/attendee.entity";
import { paginate, PaginateOptions } from "src/pagination/paginator";
import { DeleteResult, Repository } from "typeorm";
import { Event } from "./event.entity";
import { ListEvents, WhenEventFilter } from "./input/list.events";

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name)
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>
  ) {}

  private getEventsBaseQuery () {
    return this.eventsRepository
      .createQueryBuilder('e')
      .orderBy('e.id', 'DESC')
  }

  public getEventsWithAttendeeCountQuery () {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap(
        'e.attendeeCount', 'e.attendees'
      )
      .loadRelationCountAndMap( // ! make virtual field
        'e.attendeeAccepted',
        'e.attendees',
        'attendee',
        (qb) => qb
          .where('attendee.answer = :answer',
          { answer: AttendeeAnswerEnum.Accepted })
      )
      .loadRelationCountAndMap(
        'e.attendeeMaybe',
        'e.attendees',
        'attendee',
        (qb) => qb
          .where('attendee.answer = :answer',
          { answer: AttendeeAnswerEnum.Maybe })
      )
      .loadRelationCountAndMap(
        'e.attendeeRejected',
        'e.attendees',
        'attendee',
        (qb) => qb
          .where('attendee.answer = :answer',
          { answer: AttendeeAnswerEnum.Rejected })
      )
  }

  private async getEventsWithAttendeeCountFiltered(
    filter?: ListEvents
  ) {
    let query = this.getEventsWithAttendeeCountQuery();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      if (filter.when == WhenEventFilter.Today) {
        query = query.andWhere(
          `e.when >= CURDATE() AND e.when <= CURDATE() + INTERVAL 1 DAY`
        );
      }

      if (filter.when == WhenEventFilter.Tomorrow) {
        query = query.andWhere(
          `e.when >= CURDATE() + INTERVAL 1 DAY AND e.when <= CURDATE() + INTERVAL 2 DAY`
        );
      }

      if (filter.when == WhenEventFilter.ThisWeek) {
        query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1)');
      }

      if (filter.when == WhenEventFilter.NextWeek) {
        query = query.andWhere('YEARWEEK(e.when, 1) = YEARWEEK(CURDATE(), 1) + 1');
      }
    }

    return query;
  }

  public async getEventsWithAttendeeCountFilteredPaginated(
    filter: ListEvents,
    PaginateOptions: PaginateOptions
  ) {
    return await paginate(
      await this.getEventsWithAttendeeCountFiltered(filter),
      PaginateOptions
    )
  }

  public async getEvent(id: number): Promise<Event | undefined> { // return Event or undefined
    const query =  await this.getEventsWithAttendeeCountQuery()
      .andWhere('e.id = :id', { id })

    this.logger.debug(query.getSql());

    return await query.getOne();
  }

  public async deleteEvent(id: number): Promise<DeleteResult> { // DeleteResult => tipe data from typeorm
    return await this.eventsRepository
    .createQueryBuilder('e')
    .delete()
    .where('id = :id', { id })
    .execute()
  }

}