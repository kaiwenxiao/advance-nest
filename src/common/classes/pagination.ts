import {IsNumber, IsOptional} from "class-validator";
import {Transform} from "class-transformer";

export class GetPaginationQuery {
  @IsOptional()
  // toClassOnly - means entity to class to get this property(read operation, not save operation)
  @Transform(({value}) => Number(value), {toClassOnly: true})
  @IsNumber({
    maxDecimalPlaces: 0,
    allowInfinity: false,
    allowNaN: false
  }, {
    message: 'Page must be an integer'
  })
  page = 1

  @IsOptional()
  @Transform(({value}) => Number(value), {toClassOnly: true})
  @IsNumber({
    maxDecimalPlaces: 0,
    allowInfinity: false,
    allowNaN: false
  }, {
    message: 'Limit must be an integer'
  })
  limit = 10
}