import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { KegiatanService } from './kegiatan.service';
import { KegiatanDto } from './dto/kegiatan.dto';

@Controller('kegiatan')
export class KegiatanController {
  constructor(private readonly kegiatanService: KegiatanService) {}

  @Post()
  async createKegiatanMitra(@Body() kegiatanDto: KegiatanDto) {
    const response = await this.kegiatanService.createKegiatan(kegiatanDto);
    return {
      status_code: 200,
      message: 'Kegiatan berhasil dibuat',
      data: response,
    };
  }

  @Get(':tahun')
  async getRekapKegiatan(@Param('tahun') tahun: string) {
    const year = Number(tahun);
    return this.kegiatanService.getRekapKegiatan(year);
  }

  @Get()
  async getRekapKegiatanByTim(
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('idSobat') idSobat?: string,
  ) {
    const tahun = Number(year);
    return this.kegiatanService.getKegiatanByTim({ tahun, month, idSobat });
  }

  @Delete(':id')
  async deleteKegiatan(@Param('id') id: string) {
    const kegiatanId = Number(id);
    return this.kegiatanService.deleteKegiatan(kegiatanId);
  }
}
