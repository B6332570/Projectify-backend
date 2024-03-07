import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ClassSerializerInterceptor,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TaskGroupService } from './task-group.service';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('task-group')
@ApiTags('task-group')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TaskGroupController {
  constructor(private readonly taskGroupService: TaskGroupService) {}

  @Post()
  async create(@Body() createTaskGroupDto: CreateTaskGroupDto) {
    return await this.taskGroupService.createTaskGroup(createTaskGroupDto);
  }
}
