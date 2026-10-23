import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  // POST /upload — any logged-in user: upload a file, returns the URL
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
      fileFilter: (_req, file, callback) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
        const isValid = allowedTypes.test(
          extname(file.originalname).toLowerCase(),
        );
        if (isValid) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException('Only image and PDF files are allowed'),
            false,
          );
        }
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    const port = process.env.PORT || 3000;
    const baseUrl = process.env.BACKEND_URL || 'http://localhost:' + port;
    return {
      url: baseUrl + '/uploads/' + file.filename,
      filename: file.filename,
    };
  }
}
