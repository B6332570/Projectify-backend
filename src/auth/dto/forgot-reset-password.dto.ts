import { ApiProperty } from '@nestjs/swagger';

export class ResetForgotPasswordDto {
  @ApiProperty()
  password: string;
}
