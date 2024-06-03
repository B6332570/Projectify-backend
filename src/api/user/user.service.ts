import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CrudService } from '@Base/crud.service';
import { UserEntity } from '@Database/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { UserRoleEntity } from '@Database/entities/user-role.entity';

@Injectable()
export class UserService extends CrudService<UserEntity> {
  protected readonly repository: Repository<UserEntity>;
  private userRoleRepository: Repository<UserRoleEntity>;

  constructor(private dataSource: DataSource) {
    super();
    this.repository = this.dataSource.getRepository(UserEntity);
    this.userRoleRepository = this.dataSource.getRepository(UserRoleEntity);
  }

  async validateEmail(email: string, id?: number) {
    const user = await this.repository.findOne({ where: { email } });
    if (id && user.id !== id) {
      throw new BadRequestException('Email is duplicate');
    } else if (!id && user) {
      throw new BadRequestException('Email is duplicate');
    }
  }

  async findAllUser() {
    return await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.userRoles', 'userRole')
      .leftJoinAndSelect('userRole.role', 'role')
      .select([
        'user.id',
        'user.isDelete',
        'user.createdAt',
        'user.updatedAt',
        'user.deletedAt',
        'user.username',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.imageId',
        'userRole.roleId',
        'role.role',
      ])
      .getMany();
  }

  async updateUser(id: number, body: UpdateUserDto) {
    const { roles, ...userData } = body;
    await this.dataSource.getRepository(UserEntity).update(id, userData);

    const user = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id },
      relations: ['userRoles'],
    });

    if (user) {
      await this.userRoleRepository.delete({ user: { id: user.id } });

      const newUserRoles = roles.map((roleId) => ({
        user: user,
        roleId: roleId,
      }));

      await this.userRoleRepository.save(newUserRoles);
    }

    return this.getProfile(id);
  }

  async getProfile(id: number) {
    const profile = await this.dataSource.getRepository(UserEntity).findOne({
      where: { id },
      relations: ['userRoles', 'userRoles.role'],
      select: ['id', 'username', 'firstName', 'lastName', 'imageId'],
    });

    if (!profile) {
      return null;
    }

    const userRoles = profile.userRoles.map((userRole) => ({
      roleId: userRole.roleId,
      role: {
        role: userRole.role.role,
      },
    }));

    return {
      ...profile,
      userRoles,
    };
  }
}
