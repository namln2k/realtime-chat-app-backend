import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('users')
export class UsersController {
  constructor() {}

  @UseGuards(JwtGuard)
  @Get('me')
  async me() {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return 'me';
  }
}
