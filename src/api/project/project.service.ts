import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CrudService } from '@Base/crud.service';
import { ProjectEntity } from '@Database/entities/project.entity';
import { DataSource, Repository } from 'typeorm';
import { IUserInfoDecorator } from '@Shared/interface/userinfo.interface';
import { ExcelService } from '@Api/excel/excel.service';
import { Response } from 'express';

@Injectable()
export class ProjectService extends CrudService<ProjectEntity> {
  protected readonly repository: Repository<ProjectEntity>;
  constructor(
    private dataSource: DataSource,
    private readonly excelService: ExcelService,
  ) {
    super();
    this.repository = this.dataSource.getRepository(ProjectEntity);
  }

  async findAllProject() {
    return await this.repository
      .createQueryBuilder('project')
      .select('project')
      .leftJoinAndSelect('project.taskGroups', 'taskGroup')
      .leftJoinAndSelect('taskGroup.taskItems', 'taskItem')
      .getMany();
  }

  async getProjectById(id: number) {
    const project = await this.repository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.taskGroups', 'taskGroup')
      .leftJoinAndSelect('taskGroup.taskItems', 'taskItem')
      .where('project.id = :id', { id })
      .getOne();

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    return project;
  }

  async createProject(body: CreateProjectDto, userInfo: IUserInfoDecorator) {
    const { projectsName } = body;
    const newProject = await this.repository.save({
      projectsName: projectsName,
      userId: userInfo.id,
    });
    return newProject;
  }

  async updateProject(id: number, body: UpdateProjectDto) {
    const project = await this.repository.findOneBy({ id: id });

    if (!project) {
      throw new Error('Project not found');
    }

    const isDataDifferent = Object.keys(body).some(
      (key) => project[key] !== body[key],
    );

    if (!isDataDifferent) {
      return project;
    }

    const updatedProject = await this.repository.save({
      ...project,
      ...body,
    });

    return updatedProject;
  }

  async exportProject(res: Response) {
    const headers = [
      'project name',
      'task group name',
      'title',
      'task name',
      'description',
      'os',
      'status',
      'start date',
      'end date',
      'priority',
    ];
    const result = await this.findAllProject();
    const data = result.map((item) => {
      const taskGroup = item.taskGroups.map((cItem) => {
        const taskItem = cItem.taskItems.map((c2Item) => {
          const format = {
            title: c2Item.title,
            taskName: c2Item.taskName,
            description: c2Item.description,
            os: c2Item.os,
            status: c2Item.status,
            startDate: c2Item.startDate,
            endDate: c2Item.endDate,
            priority: c2Item.priority,
          };
          return format;
        });
        const format = { taskGroupName: cItem.taskGroupName, taskItem };
        return format;
      });
      const format = { projectsName: item.projectsName, taskGroup };
      return format;
    });
    await this.excelService.exportExcel(res, headers, data);
  }
}
