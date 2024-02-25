import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TaskGroupService } from './task-group.service';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';

@Controller('task-group')
export class TaskGroupController {
  constructor(private readonly taskGroupService: TaskGroupService) {}
}
