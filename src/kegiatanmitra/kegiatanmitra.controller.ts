import { Controller, Get, Post, Body, Delete, Param, BadRequestException, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { KegiatanmitraService } from './kegiatanmitra.service';
import { KegiatanMitraDto } from './dto/kegiatanmitra.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('kegiatanmitra')
export class KegiatanmitraController {
    constructor(private readonly KegiatanmitraService: KegiatanmitraService) {}

  @Get()
  async getKegiatanMitra(
    @Query('year') year?  : string,
    @Query('month') month? : string,
    @Query('tim') tim? : string
  ) {
    const kegiatanmitra = await this.KegiatanmitraService.getKegiatanMitra({year, month, tim});
    return {
      status_code: 200,
      message: 'Succes get all kegiatan mitra',
      data: kegiatanmitra,
    };
  }

  @Post()
  async createKegiatanMitra(@Body() createKegiatanMitra: KegiatanMitraDto ) {
    const response = await this.KegiatanmitraService.createKegiatanMitra(createKegiatanMitra);
    return {
      status_code: 200,
      message: 'Kegiatan Mitra berhasil dibuat',
      data : response,
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTemplate(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File tidak ditemukan.');
    }

    const result = await this.KegiatanmitraService.uploadExcelFile(file);

    return {
      status_code: 200,
      message: 'File berhasil diupload',
      data : result,
    };
  }

  @Post('save')
  async saveValidatedData(@Body() data: any) {
    const result = await this.KegiatanmitraService.processExcelFile(data);
    return {
      status_code: 200,
      message: 'File berhasil dikirim',
      data : result,
    };
  }

  @Get('count/:tahun')
  async countKegiatanMitra(@Param('tahun') tahun:string){
    const year = Number(tahun)
    const result = await this.KegiatanmitraService.countKegiatanMitra(year);
    return {
      status_code: 200,
      message: 'Get jumlah kegiatan mitra success',
      data : result,
    };
  }

  @Get('count/')
  async countMitraKegiatanHonor(
    @Query('year') year?  : string,
    @Query('month') month? : string,
    @Query('idSobat') idSobat? : string
  ){
    const tahun = Number(year)
    const result = await this.KegiatanmitraService.countMitraKegiatanHonor({year, month, idSobat});
    return {
      status_code: 200,
      message: 'Get jumlah kegiatan mitra success',
      data : result,
    };
  }

    @Get(':id')
  async getKegiatanMitraById(@Param('id') id: number) {
    const idMitra = Number(id);
    return this.KegiatanmitraService.getKegiatanMitraById(idMitra);
  }

@Delete('delete')
async deleteKegiatanMitra(@Body() kegiatanMitraDto: KegiatanMitraDto,) {
  const { id } = kegiatanMitraDto; 
    try {
      const result = await this.KegiatanmitraService.deleteKegiatanMitra(
        id
      );

      return {
        message: 'Delete succesfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
}
}