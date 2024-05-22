import { UserService } from '@Api/user/user.service';
import { UserEntity } from '@Database/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ENUMErrorMessages } from '@Shared/enum/error-message.enum';
import { compareSync, compare } from 'bcrypt';
import { DataSource } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ResetForgotPasswordDto } from './dto/forgot-reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private readonly userService: UserService,
    @InjectQueue('send_mail') private readonly mailerQueue: Queue,
  ) {}

  // async validateUser(
  //   email: string,
  //   password: string,
  //   role: string,
  // ): Promise<UserEntity> {
  //   const user = await this.dataSource
  //     .getRepository(UserEntity)
  //     .createQueryBuilder('user')
  //     .select(['user', 'user.password'])
  //     .leftJoinAndSelect('user.role', 'role')
  //     .where('user.isDelete = :isDelete', { isDelete: false })
  //     .andWhere('user.email = :email', {
  //       email: email,
  //     })
  //     .andWhere('user.role = :role', {
  //       role: role,
  //     })
  //     .getOne();

  //   if (!user) {
  //     throw new UnauthorizedException(ENUMErrorMessages.TRY_LOGIN_AGAIN);
  //   }
  //   if (user && compareSync(password, user.password)) {
  //     return user;
  //   } else {
  //     throw new UnauthorizedException(ENUMErrorMessages.TRY_LOGIN_AGAIN);
  //   }
  // }

  async validateUser(
    email: string,
    password: string,
    // role: string,
  ): Promise<UserEntity> {
    const user = await this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder('user')
      .select(['user', 'user.password'])
      .where('user.isDelete = :isDelete', { isDelete: false })
      .andWhere('user.email = :email', { email })
      // .andWhere('user.role = :role', { role })
      .getOne();

    if (!user) {
      throw new UnauthorizedException(ENUMErrorMessages.TRY_LOGIN_AGAIN);
    }
    if (user && compareSync(password, user.password)) {
      return user;
    } else {
      throw new UnauthorizedException(ENUMErrorMessages.TRY_LOGIN_AGAIN);
    }
  }

  async register(registerDto: RegisterDto) {
    const { email, password, role, firstName, lastName, username, imageId } =
      registerDto;
    await this.userService.validateEmail(email);
    return await this.userService.create({
      email,
      password,
      role,
      firstName,
      lastName,
      imageId,
      username,
    });
  }

  async resetPassword(id: number, body: ResetPasswordDto) {
    const user = await this.userService.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('ไม่พบผู้ใช้งาน');
    }
    const isSame = await this.comaparaHash(body.oldPassword, user.password);
    if (!isSame) {
      throw new BadRequestException('รหัสผ่านเดิมไม่ถูกต้อง');
    }
    await this.userService.patch(id, { password: body.password });
  }

  async comaparaHash(oldPassword: string, hashPassword: string) {
    return compare(oldPassword, hashPassword);
  }

  async forgotPassword(body: ForgotPasswordDto) {
    const user = await this.userService.findOne({
      where: { email: body.email },
    });
    if (!user) {
      throw new NotFoundException('ไม่พบอีเมลในระบบ');
    }
    await this.mailerQueue.add('send_reset_password', {
      email: body.email, // List of receivers email address
      userId: user.id,
    });
  }

  async resetForgotPassword(id: number, body: ResetForgotPasswordDto) {
    await this.userService.patch(id, { password: body.password });
  }
}
