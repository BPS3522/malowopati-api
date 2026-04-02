import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { EvaluasiService } from './evaluasi.service';

@Controller('evaluasi')
export class EvaluasiController {
  constructor(private readonly evaluasiService: EvaluasiService) {}

  @Get()
  async getEvaluasiBulan(@Query('month') month: string, @Query('year') year: string) {
    return this.evaluasiService.getEvaluasiBulan({ year, month });
  }

  @Post()
  async saveEvaluasiBulan(@Body() body: { bulan: string; tahun: string; data: any[] }) {
    const { bulan, tahun, data } = body;
    return this.evaluasiService.saveEvaluasiBulan(bulan, tahun, data);
  }
}
