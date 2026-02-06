import {
  Body,
  Controller,
  Get,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthPayload } from 'src/common/types/authenticated-request.type';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async me(@CurrentUser() user: AuthPayload) {
    return this.usersService.findById(user.sub);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateMe(
    @CurrentUser() user: AuthPayload,
    @Body(new ValidationPipe({ whitelist: true })) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.sub, updateUserDto);
  }
}
