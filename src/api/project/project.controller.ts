import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserInfo } from '@Shared/decorator/userinfo.decorator';
import { IUserInfoDecorator } from '@Shared/interface/userinfo.interface';

@Controller('project')
@ApiTags('project')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UserInfo() userInfo: IUserInfoDecorator,
  ) {
    return await this.projectService.createProject(createProjectDto, userInfo);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return await this.projectService.updateProject(id, updateProjectDto);
  }

  @Get()
  async findAll() {
    return await this.projectService.findAllProject();
  }
}
