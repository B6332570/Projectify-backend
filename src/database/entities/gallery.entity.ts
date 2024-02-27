import { ExtendedEntity } from '../common/extended-entity';
import { Entity, ManyToOne, JoinColumn, Column } from 'typeorm';

import { MediaObjectEntity } from './media-object.entity';
import { UserEntity } from './user.entity';

@Entity()
export class GalleryEntity extends ExtendedEntity {
  // @ManyToOne(() => MediaObjectEntity, { nullable: false })
  // @JoinColumn({ name: 'image_id' })
  // image: MediaObjectEntity;
  // @Column({ name: 'image_id', nullable: false })
  // imageId: number;
  // @Column({ name: 'user_id', nullable: true })
  // userId: number;
  // @ManyToOne(() => UserEntity, { nullable: false })
  // @JoinColumn({ name: 'user_id' })
  // user: UserEntity;
}
