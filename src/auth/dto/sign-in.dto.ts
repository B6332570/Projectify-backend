import { ENUM_ROLE } from '@Shared/enum/user.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'admin', required: true })
  @IsString()
  username: string;

  @ApiProperty({ example: 'admin', required: true })
  @IsString()
  password: string;

  @ApiProperty({ enum: ENUM_ROLE, required: true })
  @IsString()
  role: string;
}
