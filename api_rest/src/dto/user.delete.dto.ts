import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class deleteUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
