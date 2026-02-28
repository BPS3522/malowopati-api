import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BatashonorService {
  constructor(private prisma: PrismaService) {}

  async getBatasHonorService() {
    return this.prisma.batasHonor.findMany();
  }
}
