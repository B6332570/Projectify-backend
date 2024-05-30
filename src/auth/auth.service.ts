import { UserService } from '@Api/user/user.service';
import { UserEntity } from '@Database/entities/user.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ENUMErrorMessages } from '@Shared/enum/error-message.enum';
import { compareSync, compare, hash } from 'bcrypt';
import { DataSource, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ResetForgotPasswordDto } from './dto/forgot-reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AuthService {
  private userRepository: Repository<UserEntity>;
  constructor(
    private dataSource: DataSource,
    private readonly userService: UserService,
    private jwtService: JwtService, // Inject JwtService
    @InjectQueue('send_mail') private readonly mailerQueue: Queue,
  ) {
    this.userRepository = this.dataSource.getRepository(UserEntity);
  }

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
    const payload = {
      id: user.id,
      email: user.email,
    };
    const token = this.jwtService.sign(payload, { expiresIn: '1h' });
    await this.mailerQueue.add('send_reset_password', {
      email: body.email, // List of receivers email address
      userId: user.id,
      token: token,
    });
  }

  // async resetForgotPassword(id: number, body: ResetForgotPasswordDto) {
  //   await this.userService.patch(id, { password: body.password });
  // }

  public async resetForgotPassword(
    token: string,
    body: ResetForgotPasswordDto,
  ): Promise<any> {
    // Decode the token to extract the user ID or other payload
    // console.log('token: ', token);
    // console.log('newPassword: ', body.password);
    let decoded: any;
    try {
      decoded = this.jwtService.verify(token, {
        publicKey: readFileSync(join(process.cwd(), 'rsa.public'), 'utf8'),
      });
      // console.log('decode >>> ', decoded);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('Token has expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('Invalid token');
      } else {
        throw new BadRequestException('Error processing token');
      }
    }

    const userId = decoded.id;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = body.password;

    const result = await this.userRepository.save(user);
    // console.log('User updated with new password:', result);

    return { message: 'Password reset successfully' };
  }
}
