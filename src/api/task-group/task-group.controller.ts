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
  ParseIntPipe,
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

  @Get()
  async findAll() {
    return await this.taskGroupService.findAllTaskGroup();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.taskGroupService.getTaskGroupById(id);
  }

  @Post()
  async create(@Body() createTaskGroupDto: CreateTaskGroupDto) {
    return await this.taskGroupService.createTaskGroup(createTaskGroupDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskGroupDto: UpdateTaskGroupDto,
  ) {
    return await this.taskGroupService.updateTaskGroup(id, updateTaskGroupDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.taskGroupService.softDelete({ id });
  }
}
