import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { multerConfig } from '../config/multer.config';
import { FilesService } from './files.service';
import { FileUploadDto, FileResponseDto } from './dto/file.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // POST: Upload single file
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() fileUploadDto: FileUploadDto,
  ): Promise<FileResponseDto> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    return this.filesService.saveFileMetadata(file, fileUploadDto.description);
  }

  // POST: Upload multiple files
  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() fileUploadDto: FileUploadDto,
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('No files uploaded', HttpStatus.BAD_REQUEST);
    }

    const results: FileResponseDto[] = [];
    for (const file of files) {
      const result = await this.filesService.saveFileMetadata(file, fileUploadDto.description);
      results.push(result);
    }

    return {
      status_code: 200,
      message: 'Succes create files',
      data: results,
    };
  }

  // GET: Download/View file by filename
  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    try {
      const filePath = await this.filesService.getFilePath(filename);
      res.sendFile(filePath);
    } catch (error) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }

  // GET: Get file metadata
  @Get('info/:filename')
  async getFileInfo(@Param('filename') filename: string): Promise<FileResponseDto> {
    return this.filesService.getFileInfo(filename);
  }

  // GET: List all files
  @Get('list')
  async listFiles(): Promise<FileResponseDto[]> {
    return this.filesService.getAllFiles();
  }

  // GET: Stream file (untuk file besar)
  @Get('stream/:filename')
  async streamFile(@Param('filename') filename: string, @Res() res: Response): Promise<void> {
    try {
      await this.filesService.streamFile(filename, res);
    } catch (error) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
  }
}
