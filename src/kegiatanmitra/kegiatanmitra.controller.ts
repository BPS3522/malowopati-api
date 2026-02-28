import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  Query,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  Put,
  Patch,
} from '@nestjs/common';
import { KegiatanmitraService } from './kegiatanmitra.service';
import { KegiatanMitraDto } from './dto/create-kegiatan-mitra.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DownloadKegiatanMitraQueryDto } from './dto/download-kegiatan-mitra.dto';
import { DeleteKegiatanMitra } from './dto/delete-kegiatan-mitra.dto';

@Controller('kegiatanmitra')
export class KegiatanmitraController {
  constructor(private readonly KegiatanmitraService: KegiatanmitraService) {}

  @Get()
  async getKegiatanMitra(
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('tim') tim?: string,
  ) {
    const kegiatanmitra = await this.KegiatanmitraService.getKegiatanMitra({ year, month, tim });
    return {
      status_code: 200,
      message: 'Succes get all kegiatan mitra',
      data: kegiatanmitra,
    };
  }

  @Post()
  async createKegiatanMitra(@Body() createKegiatanMitra: KegiatanMitraDto) {
    const response = await this.KegiatanmitraService.createKegiatanMitra(createKegiatanMitra);
    return {
      status_code: 200,
      message: 'Kegiatan Mitra berhasil dibuat',
      data: response,
    };
  }

  @Patch()
  async editKegiatanMitra(@Body() editKegiatanMitra: any) {
    try {
      const response = await this.KegiatanmitraService.editKegiatanMitra(editKegiatanMitra);
      return {
        status_code: 200,
        message: 'Kegiatan Mitra berhasil diupdate',
        data: response,
      };
    } catch (error) {
      throw new BadRequestException('Edit Gagal');
    }
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
      data: result,
    };
  }

  @Post('save')
  async saveValidatedData(@Body() data: any) {
    const result = await this.KegiatanmitraService.processExcelFile(data);
    return {
      status_code: 200,
      message: 'File berhasil dikirim',
      data: result,
    };
  }

  @Get('count/:tahun')
  async countKegiatanMitra(@Param('tahun') tahun: string) {
    const year = Number(tahun);
    const result = await this.KegiatanmitraService.countKegiatanMitra(year);
    return {
      status_code: 200,
      message: 'Get jumlah kegiatan mitra success',
      data: result,
    };
  }

  @Get('count/')
  async countMitraKegiatanHonor(
    @Query('year') year?: string,
    @Query('month') month?: string,
    @Query('idSobat') idSobat?: string,
  ) {
    const tahun = Number(year);
    const result = await this.KegiatanmitraService.countMitraKegiatanHonor({
      year,
      month,
      idSobat,
    });
    return {
      status_code: 200,
      message: 'Get jumlah kegiatan mitra success',
      data: result,
    };
  }

  @Get('download')
  @UsePipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  async downloadKegiatanMitra(@Query() query: DownloadKegiatanMitraQueryDto) {
    const result = this.KegiatanmitraService.downloadKegiatanMitra(query);
    return result;
  }

  @Get(':idSobat')
  async getKegiatanMitraById(
    @Param('idSobat', ParseIntPipe) idSobat: number,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const bulan = month;
    const tahun = Number(year);
    const id = Number(idSobat);
    return this.KegiatanmitraService.getKegiatanMitraById({ id, tahun, bulan });
  }

  @Delete('delete')
  async deleteKegiatanMitra(@Body() kegiatanMitraDto: DeleteKegiatanMitra) {
    const { id } = kegiatanMitraDto;
    try {
      const result = await this.KegiatanmitraService.deleteKegiatanMitra(id);

      return {
        message: 'Delete succesfully',
        data: result,
      };
    } catch (error) {
      throw error;
    }
  }
}
