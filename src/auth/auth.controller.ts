import { SERIALIZE_GROUP } from '@Database/common/enum/serialization-group.enum';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Param,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { IJwtPayload } from '@Shared/interface/jwt.interface';
import { JWT_TYPE } from '../shared/enum/jwt.enum';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetForgotPasswordDto } from './dto/forgot-reset-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRoleEntity } from '@Database/entities/user-role.entity';
import { Repository } from 'typeorm';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>,
  ) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() signInDto: SignInDto) {
    const { username, password /*, role*/ } = signInDto;

    const user = await this.authService.validateUser(
      username,
      password /*role,*/,
    );

    const userRoles = await this.userRoleRepository.find({
      where: { userId: user.id },
      relations: ['role'],
    });

    const roles = userRoles.map((ur) => ur.role.role);

    const payload: IJwtPayload = {
      id: user.id,
      roles: roles,
    };
    const acToken = this.jwtService.sign({
      ...payload,
      type: JWT_TYPE.AC_TOKEN,
    });

    const _resp: any = {
      id: user.id,
      firstName: user?.firstName,
      lastName: user?.lastName,
      userName: user?.username,
      email: user?.email,
      roles: roles,
      accessToken: acToken,
    };
    return _resp;
  }

  @Post('register')
  @HttpCode(200)
  @SerializeOptions({ groups: [SERIALIZE_GROUP.GROUP_USER] })
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('/:id/reset-password')
  @HttpCode(200)
  @SerializeOptions({ groups: [SERIALIZE_GROUP.GROUP_USER] })
  @UseInterceptors(ClassSerializerInterceptor)
  async resetPassword(@Body() body: ResetPasswordDto, @Param('id') id: number) {
    return await this.authService.resetPassword(id, body);
  }

  @Post('forget-password')
  @HttpCode(200)
  @SerializeOptions({ groups: [SERIALIZE_GROUP.GROUP_USER] })
  @UseInterceptors(ClassSerializerInterceptor)
  async forgetPassword(@Body() body: ForgotPasswordDto) {
    return await this.authService.forgotPassword(body);
  }

  // @Post('reset-forget-password/:id')
  // @HttpCode(200)
  // @SerializeOptions({ groups: [SERIALIZE_GROUP.GROUP_USER] })
  // @UseInterceptors(ClassSerializerInterceptor)
  // async resetForgotPassword(
  //   @Body() body: ResetForgotPasswordDto,
  //   @Param('id') id: number,
  // ) {
  //   return await this.authService.resetForgotPassword(id, body);
  // }

  @Post('reset-forget-password/:token')
  @HttpCode(200)
  @SerializeOptions({ groups: [SERIALIZE_GROUP.GROUP_USER] })
  @UseInterceptors(ClassSerializerInterceptor)
  async resetForgotPassword(
    @Body() body: ResetForgotPasswordDto,
    @Param('token') token: string,
  ) {
    return await this.authService.resetForgotPassword(token, body);
  }
}
