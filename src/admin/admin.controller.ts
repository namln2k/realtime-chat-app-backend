import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UserRole } from 'src/common/constants/roles.constants';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('admin')
export class AdminController {
  @UseGuards(JwtGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @Get()
  async admin() {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return 'admin';
  }
}
