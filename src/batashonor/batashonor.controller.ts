import { Controller, Get } from '@nestjs/common';
import { BatashonorService } from './batashonor.service';

@Controller('batashonor')
export class BatashonorController {
  constructor(private readonly batasHonorService: BatashonorService) {}

  @Get()
  async getBatasHonor() {
    const batasHonor = await this.batasHonorService.getBatasHonorService();
    return {
      status_code: 200,
      message: 'Succes get all movies',
      data: batasHonor,
    };
  }
}
