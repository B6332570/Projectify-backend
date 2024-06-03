import { ExtendedEntity } from '@Database/common/extended-entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';

@Entity()
export class UserRoleEntity extends ExtendedEntity {
  @ManyToOne(() => UserEntity, (user) => user.userRoles)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => RoleEntity, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
  @Column({ name: 'role_id' })
  roleId: number;
}
