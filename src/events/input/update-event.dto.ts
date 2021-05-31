import { PartialType } from "@nestjs/mapped-types";
import { CreateEventDto } from "./create-event.dto";

export class UpdateEventDto extends PartialType(CreateEventDto) {
  /* use PartialType will make CreateEventDto property is optional
  name?: string;
  description?: string;
  when?: string;
  address?: string; */
}