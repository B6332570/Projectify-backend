import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ExcelModule } from '@Api/excel/excel.module';

@Module({
  imports: [ExcelModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
