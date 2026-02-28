import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MitraService {
  constructor(private prisma: PrismaService) {}

  // get semua mitra
  async getMitra() {
    return this.prisma.mitra.findMany();
  }
}
