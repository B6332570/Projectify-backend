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
import { TaskItemService } from './task-item.service';
import { CreateTaskItemDto } from './dto/create-task-item.dto';
import { UpdateTaskItemDto } from './dto/update-task-item.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('task-item')
@ApiTags('task-item')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class TaskItemController {
  constructor(private readonly taskItemService: TaskItemService) {}

  @Get()
  async findAll() {
    return await this.taskItemService.findAllTaskItem();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.taskItemService.getTaskItemById(id);
  }

  @Post()
  async create(@Body() createTaskItemDto: CreateTaskItemDto) {
    return await this.taskItemService.createTaskItem(createTaskItemDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskItemDto: UpdateTaskItemDto,
  ) {
    return await this.taskItemService.updateTaskItem(id, updateTaskItemDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.taskItemService.removeTaskById(id);
  }
}
