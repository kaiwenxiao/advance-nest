// .dto mostly used network transform
// all class-validator validator use in request
import {IsNotEmpty} from "class-validator";

export class UserLoginDto {
  @IsNotEmpty()
  email!: string

  @IsNotEmpty()
  password!: string
}
