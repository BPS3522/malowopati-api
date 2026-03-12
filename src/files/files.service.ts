import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, existsSync, statSync } from 'fs';
import { join } from 'path';
import { FileResponseDto } from './dto/file.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FilesService {
  private readonly uploadPath = './uploads';
  constructor(private prisma: PrismaService) {}

  
  async saveFileMetadata(
    file: Express.Multer.File,
    description?: string,
  ): Promise<FileResponseDto> {
    return this.prisma.files.create({
      data: {
        filename: file.filename,
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        path: file.path,
        uploadDate: new Date(),
        description: description,
      },
    });
  }

  async getFilePath(filename: string): Promise<string> {
    const filePath = join(process.cwd(), this.uploadPath, filename);

    if (!existsSync(filePath)) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }

    return filePath;
  }

  async getFileInfo(filename: string): Promise<FileResponseDto> {
    const filePath = await this.getFilePath(filename);
    const stats = statSync(filePath);

    return {
      filename: filename,
      originalName: filename,
      mimetype: 'application/octet-stream',
      size: stats.size,
      path: filePath,
      uploadDate: stats.birthtime,
    };
  }

  async getAllFiles(): Promise<FileResponseDto[]> {
    let fileInfos: FileResponseDto[] = [];
    const info = await this.prisma.files.findMany();
    fileInfos = info;

    return fileInfos;
  }

  async streamFile(filename: string, res: Response): Promise<void> {
    const filePath = await this.getFilePath(filename);
    const file = createReadStream(filePath);

    file.pipe(res);
  }
}
