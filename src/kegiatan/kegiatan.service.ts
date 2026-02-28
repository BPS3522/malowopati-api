import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KegiatanDto } from './dto/kegiatan.dto';
import { KegiatanmitraService } from 'src/kegiatanmitra/kegiatanmitra.service';
import { FiltersService } from 'src/filters/filters.service';
import { TypeKegiatan } from '@prisma/client';

@Injectable()
export class KegiatanService {
  constructor(
    private prisma: PrismaService,
    private readonly kegiatanmitraService: KegiatanmitraService,
    private readonly filtersService: FiltersService,
  ) {}

  async createKegiatan(dto: KegiatanDto) {
    const result = {
      bulan: dto.bulan,
      tanggal: dto.tanggal,
      tim: dto.tim,
      nama_survei: dto.nama_survei,
      nama_survei_sobat: dto.nama_survei_sobat,
      kegiatan: dto.kegiatan,
      tahun: dto.tahun,
      bulan_angka: dto.bulan_angka,
      judul: dto.judul || TypeKegiatan.PENDATAAN_LAPANGAN,
      jenis_kegiatan: dto.jenis_kegiatan || TypeKegiatan.PENDATAAN_LAPANGAN,
      hari: dto.hari,
      tanggal_mulai: dto.tanggal_mulai,
      hari_selesai: dto.hari_selesai,
      tanggal_selesai: dto.tanggal_selesai,
    };

    const kodeKeg = await this.kegiatanmitraService.generateUniqHash(result);

    const dataToSave = {
      ...result,
      id: dto.id,
      kodeKegiatan: kodeKeg,
    };

    const createdKegiatan = await this.prisma.kegiatan.create({
      data: dataToSave,
    });

    let tahunRecord = await this.filtersService.findTahun(Number(dto.tahun));

    if (!tahunRecord) {
      tahunRecord = await this.filtersService.createTahun(Number(dto.tahun));
    }

    return createdKegiatan;
  }

  async getKegiatanById(id: number) {
    return this.prisma.kegiatan.findUnique({
      where: { id },
      include: {
        mitra: true,
      },
    });
  }

  async deleteKegiatan(id: number) {
    const kegiatan = await this.getKegiatanById(id);
    let kodeKegiatan = '';
    let year = 0;

    if (!kegiatan) {
      throw new NotFoundException(`Kegiatan dengan ID ${id} tidak ditemukan.`);
    } else {
      kodeKegiatan = kegiatan.kodeKegiatan;
      year = kegiatan.tahun;
    }

    await this.filtersService.deleteTahun(year);

    try {
      await this.prisma.kegiatanMitra.deleteMany({
        where: {
          kegiatanId: kodeKegiatan,
        },
      });

      kegiatan.mitra.forEach((element) => {
        this.kegiatanmitraService.updateHonorBulanTertentu(
          element.id_sobat,
          element.bulan,
          element.tahun,
        );
      });

      return this.prisma.kegiatan.delete({
        where: { id },
      });
    } catch (error) {
      console.error('Detail Error Malowopati:', error);
      throw new BadRequestException({
        statusCode: 500,
        message: 'Gagal menyimpan data. Silakan cek konsol atau hubungi admin.',
        error: error.message,
      });
    }
  }

  async getRekapKegiatan(tahun: number) {
    // 1. Ambil semua kegiatan untuk tahun tertentu, diurutkan berdasarkan bulan
    const kegiatan = await this.prisma.kegiatan.findMany({
      where: {
        tahun: tahun,
      },
      select: {
        bulan: true,
        nama_survei: true, // Asumsi nama kolomnya 'kegiatan'
      },
      orderBy: {
        id: 'asc', // Urutkan berdasarkan ID atau properti lain yang relevan
      },
    });

    // 2. Kelompokkan data berdasarkan bulan
    const rekapKegiatan = kegiatan.reduce((acc, current) => {
      // Pastikan nama bulan tidak null
      const bulan = current.bulan || 'Tidak Diketahui';

      // Jika bulan belum ada di akumulator, inisialisasi array
      if (!acc[bulan]) {
        acc[bulan] = [];
      }

      // Tambahkan nama kegiatan ke dalam array bulan yang sesuai
      if (current.nama_survei) {
        acc[bulan].push(current.nama_survei);
      }

      return acc;
    }, {});

    // 3. Konversi objek menjadi array dari objek untuk kemudahan mapping di frontend
    const result = Object.keys(rekapKegiatan).map((bulan) => ({
      bulan: bulan,
      kegiatan: rekapKegiatan[bulan],
    }));

    return result;
  }

  async getKegiatanByTim(filters: any) {
    const { year, month, idSobat } = filters;

    const kegiatan = await this.prisma.kegiatanMitra.groupBy({
      by: ['tim', 'nama_survei'],
      where: {
        ...(idSobat ? { id_sobat: idSobat } : {}),
        ...(year ? { tahun: Number(year) } : {}),
        ...(month ? { bulan: month } : {}),
      },
      _count: { _all: true },
    });

    const groupedObj = kegiatan.reduce(
      (acc, item) => {
        if (!acc[item.tim]) {
          acc[item.tim] = {
            id: item.tim,
            label: item.tim,
            value: 0,
          };
        }
        acc[item.tim].value += 1;
        return acc;
      },
      {} as Record<string, { id: string; label: string; value: number }>,
    );

    const grouped = Object.values(groupedObj);

    const countKegiatan = await this.prisma.kegiatan.count({
      where: {
        ...(year ? { tahun: Number(year) } : {}),
        ...(month ? { bulan: month } : {}),
      },
    });

    return {
      grouped,
      total: countKegiatan,
    };
  }
}
