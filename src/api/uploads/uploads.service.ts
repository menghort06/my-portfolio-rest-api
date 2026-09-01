import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadsService {

    getFileResponse(file: Express.Multer.File) {
        return {
        message: 'File uploaded successfully',
        originalname: file.originalname,
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
        url: this.getUrl(file.filename),
        };
    }

    private getUrl(filename: string) {
        return `http://localhost:3000/uploads/${filename}`
    }
  
}
