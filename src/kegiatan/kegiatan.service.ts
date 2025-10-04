import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KegiatanDto } from './dto/kegiatan.dto';
import { KegiatanmitraService } from 'src/kegiatanmitra/kegiatanmitra.service';
import { groupBy, retry } from 'rxjs';

@Injectable()
export class KegiatanService {
    constructor(private prisma: PrismaService, private readonly kegiatanmitraService: KegiatanmitraService,) {}

  async createKegiatan(dto: KegiatanDto  ) {
    const kodeKeg = await this.kegiatanmitraService.generateUniqHash(dto)
    const result =  this.prisma.kegiatan.create({
      data: {
          id: dto.id,
            bulan    :   dto.bulan,
          tanggal  :   dto.tanggal,
            tim :        dto.tim,
          nama_survei : dto.nama_survei,
          nama_survei_sobat : dto.nama_survei_sobat,
          kegiatan   : dto.kegiatan,
          tahun       : dto.tahun,
          kodeKegiatan : kodeKeg,
      },
    });
    return result;
  }

  async getKegiatanById(id: number) {
    return this.prisma.kegiatan.findUnique({
      where: { id },
    });
  }

  async deleteKegiatan(id: number) {
    const kegiatan = await this.getKegiatanById(id)
    let kodeKegiatan =''
    
    if(!kegiatan){
      throw new NotFoundException(`Kegiatan dengan ID ${id} tidak ditemukan.`);
    } else{
      kodeKegiatan = kegiatan.kodeKegiatan
    }

    await this.prisma.kegiatanMitra.deleteMany({
      where:{
        kegiatanId: kodeKegiatan
      }
    })
    
    return this.prisma.kegiatan.delete({
      where: { id },
    });
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
    const result = Object.keys(rekapKegiatan).map(bulan => ({
      bulan: bulan,
      kegiatan: rekapKegiatan[bulan],
    }));

    return result;
  }

  async getKegiatanByTim(filters: any){
    const {year, month, idSobat} = filters

      const kegiatan = await this.prisma.kegiatanMitra.groupBy({
        by: ['tim','nama_survei'],
        where: {
              ...(idSobat ? { id_sobat: idSobat } : {}),
          ...(year ? { tahun: Number(year) } : {}),
          ...(month ? { bulan: month } : {}),
        },
        _count: { _all: true },
      });

      const groupedObj = kegiatan.reduce((acc, item) => {
        if (!acc[item.tim]) {
          acc[item.tim] = {
            id: item.tim,
            label: item.tim,
            value: 0,
          };
        }
        acc[item.tim].value += 1;
        return acc;
      }, {} as Record<string, { id: string; label: string; value: number }>);

      const grouped = Object.values(groupedObj);

      const countKegiatan = await this.prisma.kegiatan.count({
        where: {
          ...(year ? { tahun: Number(year) } : {}),
          ...(month ? { bulan: month } : {}),
        }
      });

    return {
      grouped,
      total: countKegiatan
    }
  }
}
