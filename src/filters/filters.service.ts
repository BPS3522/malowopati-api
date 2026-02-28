import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FiltersService {
  constructor(private prisma: PrismaService) {}

  async getTahun() {
    const tahun = (await this.prisma.tahun.findMany()).toSorted((a, b) => b.year - a.year);
    return tahun;
  }

  async findTahun(year: number) {
    const tahun = await this.prisma.tahun.findFirst({
      where: { year: year },
    });
    return tahun;
  }

  async createTahun(year: number) {
    const tahun = await this.prisma.tahun.create({
      data: {
        year: year,
      },
    });
    return tahun;
  }

  async deleteTahun(year: number) {
    const tahun = await this.prisma.tahun.findFirst({
      where: {
        year: year,
      },
    });

    if (tahun) {
      const countKegiatan = await this.prisma.kegiatan.count({
        where: {
          tahun: year,
        },
      });

      if (countKegiatan === 1) {
        await this.prisma.tahun.delete({
          where: {
            id: tahun.id,
          },
        });
      }
    }
    return tahun;
  }
}
