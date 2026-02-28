import { Controller, Get } from '@nestjs/common';
import { FiltersService } from './filters.service';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get('year')
  async getTahun() {
    const tahun = await this.filtersService.getTahun();
    return {
      status_code: 200,
      message: 'Succes get all tahun',
      data: tahun,
    };
  }
}
