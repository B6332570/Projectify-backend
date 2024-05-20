import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  password: string;

  @ApiProperty()
  oldPassword: string;
}
