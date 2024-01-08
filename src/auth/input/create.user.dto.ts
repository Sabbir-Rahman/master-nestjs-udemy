import { IsEmail, Length } from 'class-validator'

export class CreateUserDto {
  @Length(4)
  username: string
  @Length(6)
  password: string
  @Length(6)
  retypedPassword: string
  @Length(4)
  firstName: string
  @Length(4)
  lastName: string
  @IsEmail()
  email: string
}
