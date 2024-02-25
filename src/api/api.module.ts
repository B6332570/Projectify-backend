import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MediaObjectModule } from './media-object/media-object.module';
import { ProjectModule } from './project/project.module';
import { TaskGroupModule } from './task-group/task-group.module';
import { TaskItemModule } from './task-item/task-item.module';

@Module({
  imports: [
    UserModule,
    MediaObjectModule,
    ProjectModule,
    TaskGroupModule,
    TaskItemModule,
  ],
})
export class ApiModule {}
