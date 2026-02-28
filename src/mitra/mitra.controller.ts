import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { MitraService } from './mitra.service';

@Controller('mitra')
export class MitraController {
  constructor(private readonly mitraService: MitraService) {}

  // get semua mitra
  @Get()
  async getMitra() {
    const mitra = await this.mitraService.getMitra();
    return {
      status_code: 200,
      message: 'Succes get all movies',
      data: mitra,
    };
  }
}
