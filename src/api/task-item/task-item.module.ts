import { Module } from '@nestjs/common';
import { TaskItemService } from './task-item.service';
import { TaskItemController } from './task-item.controller';

@Module({
  controllers: [TaskItemController],
  providers: [TaskItemService],
})
export class TaskItemModule {}
