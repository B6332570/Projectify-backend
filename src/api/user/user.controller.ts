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
  Query,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserInfo } from '@Shared/decorator/userinfo.decorator';
import { IUserInfoDecorator } from '@Shared/interface/userinfo.interface';
import { PaginationQueryString } from '@Shared/dto/paginationQueryString.dto';
import { paginateResponse } from '@Shared/response/response';
import { plainToInstance } from 'class-transformer';
import { UserEntity } from '@Database/entities/user.entity';
import { SERIALIZE_GROUP } from '@Database/common/enum/serialization-group.enum';

@ApiTags('user')
@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async findAll(@Query() qs: PaginationQueryString) {
    const [result, total] = await this.userService.findAndCount({
      skip: qs.getOffset(),
      take: qs.limit,
    });
    return paginateResponse(
      plainToInstance(UserEntity, result),
      total,
      qs.limit,
      qs.page,
    );
  }

  @Get('profile')
  @SerializeOptions({
    groups: [SERIALIZE_GROUP.GROUP_USER, SERIALIZE_GROUP.GROUP_MEDIA_OBJECT],
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfile(@UserInfo() userInfo: IUserInfoDecorator) {
    return await this.userService.getProfile(userInfo.id);
  }

  @Get('profile/:id')
  @SerializeOptions({
    groups: [SERIALIZE_GROUP.GROUP_USER, SERIALIZE_GROUP.GROUP_MEDIA_OBJECT],
  })
  @UseInterceptors(ClassSerializerInterceptor)
  async getProfileById(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.getProfile(id);
  }

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
