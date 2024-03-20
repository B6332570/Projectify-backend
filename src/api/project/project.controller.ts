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
  Res,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserInfo } from '@Shared/decorator/userinfo.decorator';
import { IUserInfoDecorator } from '@Shared/interface/userinfo.interface';
import { Response } from 'express';

@Controller('project')
@ApiTags('project')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('export')
  async export(@Res() res: Response) {
    return await this.projectService.exportProject(res);
  }

  @Get()
  async findAll() {
    return await this.projectService.findAllProject();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.projectService.getProjectById(id);
  }

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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.projectService.softDelete({ id });
  }
}
