import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MediaObjectService } from './media-object.service';
import { CreateMediaObjectDto } from './dto/create-media-object.dto';
import { UpdateMediaObjectDto } from './dto/update-media-object.dto';

@Controller('media-object')
export class MediaObjectController {
  constructor(private readonly mediaObjectService: MediaObjectService) {}
}
