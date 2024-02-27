import { ApiProperty } from '@nestjs/swagger';

export class CreateMediaObjectDto {
  @ApiProperty({ type: 'file' })
  file: any;
}
