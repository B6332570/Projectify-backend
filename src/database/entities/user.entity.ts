import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
  ManyToMany,
} from 'typeorm';
import { ExtendedEntity } from '../common/extended-entity';
import {
  DB_TABLE_NAME,
  ENUMTypeColumnEntity,
} from '../common/enum/database.enum';
import { ENUM_ROLE } from 'src/shared/enum/user.enum';
import { ProjectEntity } from './project.entity';
import * as bcrypt from 'bcrypt';
import { MediaObjectEntity } from './media-object.entity';
import { TaskItemEntity } from './task-item.entity';
import { TaskUserEntity } from './task-user.entity';
import { UserRoleEntity } from './user-role.entity';

@Entity(DB_TABLE_NAME.USER)
export class UserEntity extends ExtendedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: ENUMTypeColumnEntity.TYPE_VARCHAR,
    length: 255,
    nullable: false,
    name: 'username',
  })
  username: string;

  @Column({
    type: ENUMTypeColumnEntity.TYPE_VARCHAR,
    length: 255,
    nullable: false,
    name: 'first_name',
  })
  firstName: string;

  @Column({
    type: ENUMTypeColumnEntity.TYPE_VARCHAR,
    length: 255,
    nullable: false,
    name: 'last_name',
  })
  lastName: string;

  @Column({
    type: ENUMTypeColumnEntity.TYPE_VARCHAR,
    length: 255,
    nullable: false,
    name: 'email',
    unique: true,
  })
  email: string;

  @Column({
    type: ENUMTypeColumnEntity.TYPE_VARCHAR,
    length: 255,
    nullable: false,
    name: 'password',
  })
  password: string;

  // @Column({
  //   type: ENUMTypeColumnEntity.TYPE_VARCHAR,
  //   length: 255,
  //   nullable: false,
  //   name: 'role',
  // })
  // role: ENUM_ROLE;

  // One-to-Many relationship with ProjectEntity
  @OneToMany(() => ProjectEntity, (project) => project.user)
  projects: ProjectEntity[];

  @ManyToOne(() => MediaObjectEntity, { nullable: true })
  @JoinColumn({ name: 'image_id' })
  image: MediaObjectEntity;

  @Column({ name: 'image_id', nullable: true })
  imageId: number;

  @OneToMany(() => TaskUserEntity, (task) => task.user)
  taskUsers: TaskUserEntity[];

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
  userRoles: UserRoleEntity[];

  @BeforeInsert()
  @BeforeUpdate()
  async encryptPassword() {
    const salt = await bcrypt.genSalt(10);
    if (!this?.password?.startsWith('$2a$')) {
      const encryptPassword = await bcrypt.hash(this.password, salt);
      this.password = encryptPassword;
    }
  }
}
