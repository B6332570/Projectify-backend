import { GalleryEntity } from '@Database/entities/gallery.entity';
import { MediaObjectEntity } from '@Database/entities/media-object.entity';
import { ProjectEntity } from '@Database/entities/project.entity';
import { TaskGroupEntity } from '@Database/entities/task-group.entity';
import { TaskItemEntity } from '@Database/entities/task-item.entity';
import { UserEntity } from '@Database/entities/user.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default () =>
  ({
    type: process.env.DB_DIALECT || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'yim',
    logging: process.env.DB_LOGGING === 'true',
    entities: [
      GalleryEntity,
      MediaObjectEntity,
      ProjectEntity,
      TaskGroupEntity,
      TaskItemEntity,
      UserEntity,
    ],
    migrations: [join(__dirname, 'migrations', '*{.ts,.js}')],
    cli: {
      migrationsDir: join(__dirname, 'migrations'),
    },
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    namingStrategy: new SnakeNamingStrategy(),
    autoLoadEntities: true,
  } as TypeOrmModuleOptions);
