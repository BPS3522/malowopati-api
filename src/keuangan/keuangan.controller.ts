import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { KeuanganService } from './keuangan.service';
import { KeuanganDto } from './dto/keuangan.dto';
import { UpdateKeuangaByBendaharaDto } from './dto/update-keuangan-bendahara.dto';
import { UpdateKeuangaByPPKDto } from './dto/update-keuangan-ppk.dto';
import { UpdateKeuangaByPPSPMDto } from './dto/update-keuangan-ppspm.dto';
import { UpdateKeuangaByUmumDto } from './dto/update-keuangan-umum.dto';
import { Roles } from 'src/auth/decorator/roles.decarator';
import { Role } from 'src/common/app.constants';

@Controller('keuangan')
export class KeuanganController {
  constructor(private readonly keuanganService: KeuanganService) {}

  @Post()
  async createKeuangan(@Body() keuanganDto: KeuanganDto) {
    const response = await this.keuanganService.createKegiatan(keuanganDto);
    return {
      status_code: 200,
      message: 'Keuangan berhasil dibuat',
      data: response,
    };
  }

  @Get()
  async getKuangan() {
    const response = await this.keuanganService.getAllKeuangan();
    return {
      status_code: 200,
      data: response,
    };
  }

  @Put('bendahara/:id')
  @Roles(Role.Bendahara)
  updateBendahara(@Param('id') id: string, @Body() dto: UpdateKeuangaByBendaharaDto) {
    const idKeuangan = Number(id);
    return this.keuanganService.updateByBendahara(idKeuangan, dto);
  }

  @Put('ppk/:id')
  @Roles(Role.PPK)
  updatePPK(@Param('id') id: string, @Body() dto: UpdateKeuangaByPPKDto) {
    const idKeuangan = Number(id);
    return this.keuanganService.updateByPPK(idKeuangan, dto);
  }

  @Put('ppspm/:id')
  @Roles(Role.PPSPM)
  updatePPSPM(@Param('id') id: string, @Body() dto: UpdateKeuangaByPPSPMDto) {
    const idKeuangan = Number(id);
    return this.keuanganService.updateByPPSPM(idKeuangan, dto);
  }

  @Put('umum/:id')
  @Roles(Role.Umum)
  updateUmum(@Param('id') id: string, @Body() dto: UpdateKeuangaByUmumDto) {
    const idKeuangan = Number(id);
    return this.keuanganService.updateByUmum(idKeuangan, dto);
  }
}
