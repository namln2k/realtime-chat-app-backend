import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  MinLength,
} from 'class-validator';

import { Match } from '../../common/decorators/match.decorator';

export class RegisterDto {
  @ApiProperty()
  @IsEmail(undefined, {
    message: 'Please provide a valid email address',
  })
  @IsNotEmpty({
    message: 'Please provide a valid email address',
  })
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Please provide a valid name',
  })
  @IsAlphanumeric(undefined, {
    message: 'Password must contain only letters and numbers',
  })
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Please provide a valid username',
  })
  @IsAlphanumeric(undefined, {
    message: 'Username must contain only letters and numbers',
  })
  readonly username: string;

  @ApiProperty()
  @MinLength(8, {
    message: 'Password must be at least 8 characters long',
  })
  @IsNotEmpty({
    message: 'Please provide a valid password',
  })
  readonly password: string;

  @ApiProperty()
  @IsNotEmpty({
    message: 'Please confirm your password',
  })
  @ApiProperty()
  @Match('password')
  @IsNotEmpty()
  readonly passwordConfirm: string;
}
