import { Injectable } from '@nestjs/common';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { CrudService } from '@Base/crud.service';
import { TaskGroupEntity } from '@Database/entities/task-group.entity';
import { DataSource, Repository } from 'typeorm';
import { ProjectEntity } from '@Database/entities/project.entity';

@Injectable()
export class TaskGroupService extends CrudService<TaskGroupEntity> {
  protected readonly repository: Repository<TaskGroupEntity>;
  private readonly projectRepository: Repository<ProjectEntity>;

  constructor(private dataSource: DataSource) {
    super();
    this.repository = this.dataSource.getRepository(TaskGroupEntity);
    this.projectRepository = this.dataSource.getRepository(ProjectEntity);
  }

  async createTaskGroup(body: CreateTaskGroupDto) {
    const { projectId, taskGroupName } = body;
    const project = await this.projectRepository.findOneBy({ id: projectId });
    if (!project) {
      throw new Error('Project not found');
    }

    const taskGroup = this.repository.create({
      taskGroupName: taskGroupName,
      projectId: projectId,
    });

    return await this.repository.save(taskGroup);
  }
}
