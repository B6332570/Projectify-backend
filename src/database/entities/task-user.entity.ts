import { ExtendedEntity } from '@Database/common/extended-entity';
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { TaskItemEntity } from './task-item.entity';

@Entity()
export class TaskUserEntity extends ExtendedEntity {
  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => TaskItemEntity, (task) => task.id)
  @JoinColumn({ name: 'task_id' })
  task: TaskItemEntity;
  @Column({ name: 'task_id' })
  taskId: number;
}
