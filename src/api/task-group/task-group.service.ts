import { Injectable, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException('Project not found');
    }

    const taskGroup = this.repository.create({
      taskGroupName: taskGroupName,
      projectId: projectId,
    });

    return await this.repository.save(taskGroup);
  }

  async findAllTaskGroup() {
    return await this.repository
      .createQueryBuilder('taskGroup')
      .select('taskGroup')
      .leftJoinAndSelect('taskGroup.taskItems', 'taskItems')
      .getMany();
  }

  async getTaskGroupById(id: number) {
    const taskGroup = await this.repository
      .createQueryBuilder('taskGroup')
      .select('taskGroup')
      .leftJoinAndSelect('taskGroup.taskItems', 'taskItems')
      .where('taskGroup.id = :id', { id })
      .getOne();
    if (!taskGroup) {
      throw new NotFoundException(`TaskGroup with ID ${id} not found.`);
    }
    return taskGroup;
  }

  async updateTaskGroup(id: number, body: UpdateTaskGroupDto) {
    const taskGroup = await this.repository.findOneBy({ id: id });
    if (!taskGroup) {
      throw new NotFoundException('TaskGroup not found');
    }

    const isDataDifferent = Object.keys(body).some(
      (key) => taskGroup[key] !== body[key],
    );

    if (!isDataDifferent) {
      return taskGroup;
    }

    const updatedTaskGroup = await this.repository.save({
      ...taskGroup,
      ...body,
    });

    return updatedTaskGroup;
  }
}
