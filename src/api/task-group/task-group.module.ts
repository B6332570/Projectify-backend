import { Module } from '@nestjs/common';
import { TaskGroupService } from './task-group.service';
import { TaskGroupController } from './task-group.controller';

@Module({
  controllers: [TaskGroupController],
  providers: [TaskGroupService]
})
export class TaskGroupModule {}
