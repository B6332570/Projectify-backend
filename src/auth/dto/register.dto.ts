import { ENUM_ROLE } from '@Shared/enum/user.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'admin', required: true })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin', required: true })
  @IsString()
  password: string;

  @ApiProperty({
    enum: ENUM_ROLE,
    required: true,
  })
  role: ENUM_ROLE;
}
