import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty()
  projectsName: string;

  @ApiProperty()
  title: string;
}
