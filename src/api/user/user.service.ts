import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CrudService } from '@Base/crud.service';
import { UserEntity } from '@Database/entities/user.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserService extends CrudService<UserEntity> {
  protected readonly repository: Repository<UserEntity>;
  constructor(private dataSource: DataSource) {
    super();
    this.repository = this.dataSource.getRepository(UserEntity);
  }

  async validateEmail(email: string, id?: number) {
    const user = await this.repository.findOne({ where: { email } });
    if (id && user.id !== id) {
      throw new BadRequestException('Email is duplicate');
    } else if (!id && user) {
      throw new BadRequestException('Email is duplicate');
    }
  }

  async updateUser(id: number, body: UpdateUserDto) {
    const result = await this.dataSource
      .getRepository(UserEntity)
      .update(id, body);
    return result;
  }
}
