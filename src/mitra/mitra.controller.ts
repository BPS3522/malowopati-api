import { Controller, Get, Post, Body, Param, Put, Delete, UseInterceptors, UploadedFile, HttpCode, HttpStatus, BadRequestException, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MitraService } from './mitra.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('mitra')
export class MitraController {
  constructor(private readonly mitraService: MitraService) {}

  // Get semua mitra
  @Get()
  async getMitra() {
    const mitra = await this.mitraService.getMitra();
    return {
      status_code: 200,
      message: 'Success get all mitra',
      data: mitra,
    };
  }

  @Put(':id')
  async updateMitra(@Param('id') id: string, @Body() data: any) {
    const result = await this.mitraService.updateMitra(Number(id), data);

    return {
      status_code: 200,
      message: 'Mitra updated successfully',
      data: result,
    };
  }

  @Delete(':id')
  async deleteMitra(@Param('id') id: string) {
    const result = await this.mitraService.deleteMitra(Number(id));

    return {
      status_code: 200,
      message: 'Mitra deleted successfully',
      data: result,
    };
  }

  // Upload CSV / Excel
  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');

        cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadMitra(
    @UploadedFile() file: Express.Multer.File,
    @Query('tahun') tahun: string
  ) {

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!tahun) {
      throw new BadRequestException('Tahun wajib diisi');
    }

    const result = await this.mitraService.processUploadFile(
      file,
      Number(tahun)
    );

    return {
      status_code: 200,
      message: 'Upload mitra berhasil',
      data: result,
    };
  }
}