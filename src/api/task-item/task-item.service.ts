import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskItemDto } from './dto/create-task-item.dto';
import { UpdateTaskItemDto } from './dto/update-task-item.dto';
import { CrudService } from '@Base/crud.service';
import { TaskItemEntity } from '@Database/entities/task-item.entity';
import { DataSource, Repository } from 'typeorm';
import { TaskGroupEntity } from '@Database/entities/task-group.entity';
import { TaskUserEntity } from '@Database/entities/task-user.entity';

@Injectable()
export class TaskItemService extends CrudService<TaskItemEntity> {
  protected readonly taskItemRepository: Repository<TaskItemEntity>;
  private readonly taskGroupRepository: Repository<TaskGroupEntity>;

  constructor(private dataSource: DataSource) {
    super();
    this.taskItemRepository = this.dataSource.getRepository(TaskItemEntity);
    this.taskGroupRepository = this.dataSource.getRepository(TaskGroupEntity);
  }

  async createTaskItem(body: CreateTaskItemDto) {
    const {
      title,
      taskName,
      description,
      os,
      status,
      startDate,
      endDate,
      priority,
      taskGroupId,
      users,
    } = body;
    const taskGroup = await this.taskGroupRepository.findOneBy({
      id: taskGroupId,
    });
    if (!taskGroup) {
      throw new Error('TaskGroup not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const createTaskItem = queryRunner.manager.create(TaskItemEntity, {
        title: title,
        taskName: taskName,
        description: description,
        os: os,
        status: status,
        startDate: startDate,
        endDate: endDate,
        priority: priority,
        taskGroupId: taskGroupId,
      });
      const saveTaskItem = await queryRunner.manager.save(createTaskItem);
      if (users.length > 0) {
        let usersPost = [];
        for (const item of users) {
          const format: Partial<TaskUserEntity> = {
            taskItem: saveTaskItem,
            userId: item,
          };
          usersPost = [...usersPost, format];
        }
        const createTaskUserPost = queryRunner.manager.create(
          TaskUserEntity,
          usersPost,
        );
        await queryRunner.manager.save(TaskUserEntity, createTaskUserPost);
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateTaskItem(id: number, body: UpdateTaskItemDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { users, ...updateData } = body;

      const taskItem = await queryRunner.manager.findOneBy(TaskItemEntity, {
        id,
      });
      if (!taskItem) {
        throw new NotFoundException('TaskItem not found');
      }

      const updatedTaskItem = queryRunner.manager.merge(
        TaskItemEntity,
        taskItem,
        updateData,
      );

      await queryRunner.manager.save(updatedTaskItem);
      await queryRunner.manager.delete(TaskUserEntity, { taskItemId: id });

      if (body.users && body.users.length > 0) {
        await queryRunner.manager.delete(TaskUserEntity, { taskItemId: id });

        const taskUserPosts = body.users.map((userId) => ({
          taskItemId: id,
          userId,
        }));

        await queryRunner.manager.insert(TaskUserEntity, taskUserPosts);
      }

      await queryRunner.commitTransaction();
      return updatedTaskItem;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllTaskItem() {
    return await this.taskItemRepository
      .createQueryBuilder('taskItem')
      .select('taskItem')
      .getMany();
  }

  async getTaskItemById(id: number) {
    const taskItem = await this.taskItemRepository
      .createQueryBuilder('taskItem')
      .select('taskItem')
      .where('taskItem.id = :id', { id })
      .getOne();
    if (!taskItem) {
      throw new NotFoundException(`TaskItem with ID ${id} not found.`);
    }
    return taskItem;
  }
}
