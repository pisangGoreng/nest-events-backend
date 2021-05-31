import { IsDateString, IsString, Length } from "class-validator";

export class CreateEventDto {
  /*
    ! DTO & pipe validation

    DTO maybe same like data validation with joi,
    so we expect this object structure, when we create an event

    DTO only specified for property name & value type
    and class-validator for custom validation
  */
  @IsString()
  @Length(5, 255, { message: 'the name length is wrong' })
  name: string;

  @Length(5, 255)
  description: string;

  @IsDateString()
  when: string;

  @Length(5, 255)
  address: string;
}