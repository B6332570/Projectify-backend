import { UserModule } from '@Api/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { readFileSync } from 'fs';
import { join } from 'path';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@Database/entities/user.entity';
import { UserRoleEntity } from '@Database/entities/user-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserRoleEntity]),
    JwtModule.register({
      privateKey: readFileSync(join(process.cwd(), 'rsa.private'), 'utf8'),
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '12h',
      },
    }),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    PassportModule,
    UserModule,
    BullModule.registerQueue({
      name: 'send_mail',
      defaultJobOptions: {
        removeOnComplete: {
          age: 5 * 60 * 60 * 1000,
          count: 100,
        },
        removeOnFail: {
          age: 5 * 60 * 60 * 1000,
          count: 100,
        },
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, AuthService, PassportModule],
})
export class AuthModule {}
