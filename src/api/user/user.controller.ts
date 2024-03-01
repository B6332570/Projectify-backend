import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserInfo } from '@Shared/decorator/userinfo.decorator';
import { IUserInfoDecorator } from '@Shared/interface/userinfo.interface';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('')
  async updateUser(
    @Body() body: UpdateUserDto,
    @UserInfo() userInfo: IUserInfoDecorator,
  ) {
    return await this.userService.updateUser(userInfo.id, body);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.softDelete({ id: id });
  }
}
