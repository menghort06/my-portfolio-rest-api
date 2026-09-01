import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadsService } from './uploads.service';

@Controller()
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', { // 'file' is refer to postman in tab form-data key: 'file' if use difference from 'file' can't upload
      storage: diskStorage({
        destination: './uploads',

        filename: (req, file, callback) => {
          const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9);

          callback(
            null,
            uniqueName + extname(file.originalname),
          );
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000000 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.uploadsService.getFileResponse(file);
  }
}