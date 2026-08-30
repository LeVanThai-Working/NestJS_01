import { IsEmail, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsString()
  @MaxLength(100)
  password: string;
}
