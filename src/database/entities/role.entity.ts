import { ENUMTypeColumnEntity } from '@Database/common/enum/database.enum';
import { ExtendedEntity } from '@Database/common/extended-entity';
import { ENUM_ROLE } from '@Shared/enum/user.enum';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserRoleEntity } from './user-role.entity';

@Entity()
export class RoleEntity extends ExtendedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: ENUMTypeColumnEntity.TYPE_VARCHAR,
    length: 255,
    nullable: true,
    name: 'role',
  })
  role: string;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
  users: UserRoleEntity[];
}
