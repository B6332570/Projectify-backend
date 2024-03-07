import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskGroupDto {
  @ApiProperty()
  projectId: number;

  @ApiProperty()
  taskGroupName: string;
}
