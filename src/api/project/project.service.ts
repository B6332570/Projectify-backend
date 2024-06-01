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
      .leftJoinAndSelect('taskItem.users', 'taskUser')
      .leftJoinAndSelect('taskUser.user', 'user')
      .getMany();
  }

  async responseExcel() {
    return await this.repository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.taskGroups', 'taskGroup')
      .leftJoinAndSelect('taskGroup.taskItems', 'taskItem')
      .leftJoinAndSelect('taskItem.users', 'taskUser')
      .leftJoinAndSelect('taskUser.user', 'user')
      .select([
        'project.id',
        'project.projectsName',
        'project.title',
        'taskGroup.id',
        'taskGroup.taskGroupName',
        'taskItem.id',
        'taskItem.title',
        'taskItem.taskName',
        'taskItem.description',
        'taskItem.os',
        'taskItem.status',
        'taskItem.startDate',
        'taskItem.endDate',
        'taskItem.priority',
        'taskUser.userId',
        'user.username',
      ])
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
    const { projectsName, title } = body;
    const newProject = await this.repository.save({
      projectsName: projectsName,
      title: title,
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
      'Project Name',
      'Project Title',
      'Task Group Name',
      'Task Item Name',
      'Owner',
      'Description',
      'OS',
      'Status',
      'Start Date',
      'End Date',
      'Priority',
    ];
    const result = await this.responseExcel();
    const data = result.map((item) => {
      const taskGroup = item?.taskGroups.map((cItem) => {
        const taskItem = cItem?.taskItems.map((c2Item) => {
          // สร้างอาร์เรย์ของชื่อผู้ใช้
          const userNames = c2Item?.users.map(
            (c3Item) => c3Item?.user?.username,
          );
          // รวมชื่อผู้ใช้ในอาร์เรย์เป็นสตริงหนึ่ง
          const assignedTo = userNames.join(', ');
          const format = {
            taskItem: c2Item?.taskName,
            assignedTo: assignedTo,
            description: c2Item?.description,
            os: c2Item?.os,
            status: c2Item?.status,
            startDate: c2Item?.startDate,
            endDate: c2Item?.endDate,
            priority: c2Item?.priority,
          };
          return format;
        });
        const format = { taskGroupName: cItem?.taskGroupName, taskItem };
        return format;
      });
      const format = {
        projectsName: item?.projectsName,
        title: item?.title,
        taskGroup,
      };

      return format;
    });
    await this.excelService.exportExcel(res, headers, data);
  }
}
