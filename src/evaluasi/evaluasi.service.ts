import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EvaluasiService {
  // Daftar tim statis (bisa diambil dari database jika nanti dinamis)
  private timList = ['IPDS', 'Sosial', 'Produksi', 'Distribusi', 'Harga', 'Nerwilis'];

  constructor(private prisma: PrismaService) {}

  async getEvaluasiBulan(filters: any) {
    const { year, month } = filters;

    const mitraEvaluasi = await this.prisma.mitra.findMany({
      select: {
        id: true,
        namaLengkap: true,
        sobatId: true,
        posisi: true,
        evaluasi: {
          where: {
            ...(year ? { tahun: Number(year) } : {}),
            ...(month ? { bulan: month } : {}),
          },
        },
      },
    });

    return mitraEvaluasi.map((mitra) => {
      const nilaiPerTim: Record<string, number> = {};

      for (const tim of this.timList) {
        const evalTim = mitra.evaluasi.find((ev) => ev.tim === tim);
        nilaiPerTim[tim] = evalTim?.nilai ?? 0;
      }

      const nilaiAktif = Object.values(nilaiPerTim).filter((v) => v > 0);
      const rataRata =
        nilaiAktif.length > 0
          ? Math.round(nilaiAktif.reduce((a, b) => a + b, 0) / nilaiAktif.length)
          : 0;

      return {
        sobatId: mitra.sobatId,
        namaLengkap: mitra.namaLengkap,
        posisi: mitra.posisi,
        nilaiPerTim: nilaiPerTim,
        rataRata: rataRata,
      };
    });
  }

  async saveEvaluasiBulan(
    bulan: string,
    tahun: string,
    data: Array<{ sobatId: string; tim: string; nilai: number }>,
  ) {
    const upsertPromises = data.map((item) =>
      this.prisma.evaluasiMitra.upsert({
        where: {
          sobatId_bulan_tahun_tim: {
            sobatId: item.sobatId,
            bulan,
            tahun: Number(tahun),
            tim: item.tim,
          },
        },
        update: { nilai: item.nilai },
        create: {
          sobatId: item.sobatId,
          bulan,
          tahun: Number(tahun),
          tim: item.tim,
          nilai: item.nilai,
        },
      }),
    );

    await Promise.all(upsertPromises);
    return { message: 'Evaluasi berhasil disimpan!' };
  }
}
