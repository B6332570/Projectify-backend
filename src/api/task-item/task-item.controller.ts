import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskItemService } from './task-item.service';
import { CreateTaskItemDto } from './dto/create-task-item.dto';
import { UpdateTaskItemDto } from './dto/update-task-item.dto';

@Controller('task-item')
export class TaskItemController {
  constructor(private readonly taskItemService: TaskItemService) {}
}
