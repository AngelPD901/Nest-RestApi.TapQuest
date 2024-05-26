import { IsNotEmpty, IsString } from 'class-validator';
export class loguinUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
