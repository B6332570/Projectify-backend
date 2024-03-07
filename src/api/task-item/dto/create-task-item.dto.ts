import { ENUM_OS } from '@Shared/enum/os.enum';
import { ENUM_PRIORITY } from '@Shared/enum/priority.enum';
import { ENUM_STATUS } from '@Shared/enum/status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskItemDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  taskName: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: ENUM_OS })
  os: ENUM_OS;

  @ApiProperty({ enum: ENUM_STATUS })
  status: ENUM_STATUS;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({ enum: ENUM_PRIORITY })
  priority: ENUM_PRIORITY;

  @ApiProperty()
  taskGroupId: number;

  @ApiProperty({ example: [1, 2, 3] })
  users: number[];
}
