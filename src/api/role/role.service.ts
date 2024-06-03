import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CrudService } from '@Base/crud.service';
import { RoleEntity } from '@Database/entities/role.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RoleService extends CrudService<RoleEntity> {
  protected readonly repository: Repository<RoleEntity>;
  constructor(private dataSource: DataSource) {
    super();
    this.repository = this.dataSource.getRepository(RoleEntity);
  }

  async createRole(body: CreateRoleDto) {
    const { role } = body;
    const newRole = await this.repository.save({
      role: role,
    });
    return newRole;
  }

  async findAllRole() {
    return await this.repository
      .createQueryBuilder('role')
      .select('role')
      .getMany();
  }
}
