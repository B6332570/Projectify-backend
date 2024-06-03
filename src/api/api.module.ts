import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MediaObjectModule } from './media-object/media-object.module';
import { ProjectModule } from './project/project.module';
import { TaskGroupModule } from './task-group/task-group.module';
import { TaskItemModule } from './task-item/task-item.module';
import { ExcelModule } from './excel/excel.module';
import { MailerModule } from './mailer/mailer.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    UserModule,
    MediaObjectModule,
    ProjectModule,
    TaskGroupModule,
    TaskItemModule,
    ExcelModule,
    MailerModule,
    RoleModule,
  ],
})
export class ApiModule {}
