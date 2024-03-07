import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CrudService } from '@Base/crud.service';
import { ProjectEntity } from '@Database/entities/project.entity';
import { DataSource, Repository } from 'typeorm';
import { IUserInfoDecorator } from '@Shared/interface/userinfo.interface';

@Injectable()
export class ProjectService extends CrudService<ProjectEntity> {
  protected readonly repository: Repository<ProjectEntity>;
  constructor(private dataSource: DataSource) {
    super();
    this.repository = this.dataSource.getRepository(ProjectEntity);
  }

  async createProject(body: CreateProjectDto, userInfo: IUserInfoDecorator) {
    const { projectsName } = body;
    const newProject = await this.repository.save({
      projectsName: projectsName,
      userId: userInfo.id,
    });
    return newProject;
  }
}
