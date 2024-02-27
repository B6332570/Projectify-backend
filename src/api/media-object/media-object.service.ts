import { Injectable } from '@nestjs/common';

import { CrudService } from '@Base/crud.service';
import { MediaObjectEntity } from '@Database/entities/media-object.entity';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class MediaObjectService extends CrudService<MediaObjectEntity> {
  protected readonly repository: Repository<MediaObjectEntity>;
  constructor(private dataSource: DataSource) {
    super();
    this.repository = this.dataSource.getRepository(MediaObjectEntity);
  }
  async createMedia(file: Express.Multer.File) {
    const filePath = `uploads/media/${file.filename}`;

    return await this.create({
      filePath: filePath,

      fileName: file.originalname,

      type: file.mimetype,

      directoryName: 'media',

      provider: 'local',
    });
  }
}
