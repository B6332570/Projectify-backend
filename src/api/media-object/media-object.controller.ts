import {
  Controller,
  Get,
  Post,
  Param,
  ClassSerializerInterceptor,
  SerializeOptions,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MediaObjectService } from './media-object.service';
import { CreateMediaObjectDto } from './dto/create-media-object.dto';

import { SERIALIZE_GROUP } from '@Database/common/enum/serialization-group.enum';
import { multerConfig } from '@Shared/config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('media')
@Controller('media-object')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class MediaObjectController {
  constructor(private readonly mediaObjectService: MediaObjectService) {}

  @Post('')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', multerConfig(10 * 1024 * 1024, 'media')),
    ClassSerializerInterceptor,
  )
  @ApiBody({ type: CreateMediaObjectDto })
  async createMedia(@UploadedFile() file: Express.Multer.File) {
    return await this.mediaObjectService.createMedia(file);
  }

  @Get()
  findAll() {
    return this.mediaObjectService.findAll();
  }

  @Get(':id')
  @SerializeOptions({ groups: [SERIALIZE_GROUP.GROUP_MEDIA_OBJECT] })
  findOne(@Param('id') id: number) {
    return this.mediaObjectService.findOne({ where: { id } });
  }
}
