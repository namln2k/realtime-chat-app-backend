import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LogInDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly identifier: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string;
}
