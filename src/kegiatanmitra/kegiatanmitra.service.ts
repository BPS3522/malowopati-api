import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KegiatanMitraDto } from './dto/kegiatanmitra.dto';
import * as XLSX from 'xlsx';
import { Decimal } from '@prisma/client/runtime/binary';
import { Prisma } from '@prisma/client';
import * as crypto from 'crypto';
import { isEmpty } from 'class-validator';

@Injectable()
export class KegiatanmitraService {
    constructor(private prisma: PrismaService) {}
  
    async getKegiatanMitra(filters: any) {
      const {month, year, tim} = filters

    const result = await this.prisma.kegiatan.findMany(
      {
        where:{
            ...( month ? { bulan: month} : {} ),
            ...( year ? { tahun: Number(year)} : {} ),
            ...( tim ? { tim: tim} : {} ),
        },
        include:{
          mitra: true,
        }
      }
    );
    return result;
  }

  async getKegiatanMitraById(id: number) {
    const result = await this.prisma.mitra.findUnique({
      where:{id},
      include:{
        KegiatanMitra:true
      }
    })
    return result
  }

  async countMitraKegiatanHonor(filters: any){
    const {year, month, idSobat} = filters

    const query: Prisma.MitraFindManyArgs = {
    where: {
      ...( idSobat ? { sobatId: idSobat} : {} ),
    },
    include: {
        KegiatanMitra:{
          where:{
            ...( idSobat ? { id_sobat: idSobat} : {} ),
            ...( year ? { tahun: Number(year)} : {} ),
            ...( month ? { bulan: month} : {} ),
          }
        },
        honors:{
            where:{
                ...(year ? {tahun: Number(year)} : {}),
                ...(idSobat ? {sobatId: idSobat} : {})
            }
        },
        _count: {
          select: {
            KegiatanMitra:{
              where:{
                ...( idSobat ? { id_sobat: idSobat} : {} ),
                ...( year ? { tahun: Number(year)} : {} ),
                ...( month ? { bulan: month} : {} ),
              }
            },
            honors:{
              where:{
                ...( idSobat ? { sobatId: idSobat} : {} ),
                ...( year ? { tahun: Number(year)} : {} ),
              }
            },
          },
        },
      }
  };

  const kegMitra: Prisma.KegiatanMitraFindManyArgs = {
    where:{
      ...( idSobat ? { id_sobat: idSobat} : {} ),
      ...( year ? { tahun: Number(year)} : {} ),
      ...( month ? { bulan: month} : {} ),
    }
  }

  const honorMitra= await this.prisma.honor.findMany({
    where:{
        ...( idSobat ? { sobatId: idSobat} : {} ),
        ...( year ? { tahun: Number(year)} : {} ),
      }
  })
  const honorDataWithTotal = honorMitra.map((item)=>(
  {
      total:item.januari + item.februari + item.maret + item.april + item.mei + item.juni + item.juli + item.agustus + item.september + item.oktober + item.november + item.desember
  }))

  const sumHonor = honorDataWithTotal.reduce((sum, item)=>{
    return(
      sum + item.total
    )
  },0)

    const [mitra, countMitra, countKegiatanMitra] = await this.prisma.$transaction([
      this.prisma.mitra.findMany(query),
      this.prisma.mitra.count({where: query.where}),
      this.prisma.kegiatanMitra.count({where: kegMitra.where}),
    ])

    return{
      mitra,
      countMitra,
      countKegiatanMitra,
      sumHonor
    }
  }

  async countKegiatanMitra(year : number) {
    const dataMitra = await this.prisma.mitra.findMany({
      include: {
        _count: {
          select: {
            KegiatanMitra:{
              where:{
                tahun: year
              }
            },
          },
        },
      }
    });

    const sortedData = dataMitra.sort((a, b) => {
      return b._count.KegiatanMitra - a._count.KegiatanMitra;
    });

    const formattedData = sortedData.map(mitra => ({
      id: mitra.id,
      namaLengkap: mitra.namaLengkap,
      jumlahKegiatan: mitra._count.KegiatanMitra,
    }));

    return formattedData;
  }

  async createKegiatanMitra(dto: KegiatanMitraDto  ) {
    const dataMitra = await this.prisma.mitra.findUnique({
      where:{
        sobatId: dto.id_sobat
      }
    })
    if (!dataMitra) {
      throw new NotFoundException(`Mitra dengan ID ${dto.id_sobat} tidak ditemukan.`);
    }

    const dataKegiatan = await this.prisma.kegiatan.findFirst({
      where:{
        kodeKegiatan: dto.kegiatanId
      }
    })

    if (!dataKegiatan) {
      throw new NotFoundException(`Mitra dengan ID ${dto.kegiatanId} tidak ditemukan.`);
    }

    const result =  this.prisma.kegiatanMitra.create({
      data: {
        bulan: dataKegiatan.bulan,
        tanggal: dataKegiatan.tanggal,
        tim: dataKegiatan.tim || '',
        nama_survei: dataKegiatan.nama_survei,
        nama_survei_sobat: dataKegiatan.nama_survei_sobat,
        kegiatan: dataKegiatan.kegiatan,
        pcl_pml_olah: dto.pcl_pml_olah,
        nama_petugas: dataMitra.namaLengkap,
        id_sobat: dto.id_sobat,
        satuan: dto.satuan,
        volum: dto.volum,
        harga_per_satuan: dto.harga_per_satuan,
        jumlah: dto.jumlah,
        konfirmasi: dto.konfirmasi,
        flag_sobat: dto.flag_sobat,
        tahun: dataKegiatan.tahun,
        kegiatanId: dto.kegiatanId
      },
    });
    const honorPayload = {
      ...dto,
      bulan: dataKegiatan.bulan,
      tahun: dataKegiatan.tahun,
    };
    await this.updateHonorPerBulan(honorPayload);

    return result;
  }

  async deleteKegiatanMitra(id: number) {
  const kegiatanMitra = await this.prisma.kegiatanMitra.findUnique({
    where: { id },
    select: {
      id_sobat: true,
      bulan: true,
      tahun: true,
    },
  });

  if (!kegiatanMitra) {
    throw new NotFoundException(`Kegiatan mitra dengan ID ${id} tidak ditemukan.`);
  }

  await this.prisma.kegiatanMitra.delete({
    where: { id },
  });

  await this.updateHonorBulanTertentu(kegiatanMitra.id_sobat, kegiatanMitra.bulan, kegiatanMitra.tahun);

  return { status: 'success', message: 'Kegiatan mitra berhasil dihapus.' };
}

async updateHonorBulanTertentu(id_sobat: string, bulan: string, tahun: number) {
  const bulanKey = bulan.toLowerCase() as keyof Prisma.HonorUpdateInput;

  const totalHonorResult = await this.prisma.kegiatanMitra.aggregate({
    _sum: {
      jumlah: true,
    },
    where: {
      id_sobat: id_sobat,
      bulan: bulan,
      tahun: tahun,
    },
  });

  const totalHonor = totalHonorResult._sum.jumlah || 0;

  const updateData: any = {};
  updateData[bulanKey] = totalHonor;

  await this.prisma.honor.upsert({
    where: {
      sobatId_tahun: {
        sobatId: id_sobat,
        tahun: tahun,
      },
    },
    create: {
      sobatId: id_sobat,
      tahun: tahun,
      [bulanKey]: totalHonor,
    },
    update: updateData,
  });
}

   async updateHonorPerBulan(data: any[] | KegiatanMitraDto) {

    if(Array.isArray(data) === true){
    // 1. Kelompokkan data yang diunggah berdasarkan sobatId dan bulan
    const honorPerBulan = data.reduce((acc, current) => {
        // Ganti id_sobat menjadi sobatId
        const sobatId = current.id_sobat; 
        const bulan = String(current.bulan).toLowerCase();
        
        // Buat kunci unik
        const key = `${sobatId}-${bulan}`;

        if (!acc[key]) {
            acc[key] = {
                // Gunakan properti sobatId
                sobatId: sobatId, 
                bulan: bulan,
                total_jumlah: new Decimal(0),
                tahun: current.tahun,
            };
        }
        
        acc[key].total_jumlah = acc[key].total_jumlah.plus(current.jumlah);

        return acc;
    }, {});
    

    // 2. Buat array dari hasil pengelompokan
    const honorToUpdate = Object.values(honorPerBulan);

    // 3. Lakukan pembaruan atau pembuatan data di tabel Honor
    await this.prisma.$transaction(
        honorToUpdate.map((honor: any) => {
            const bulanKey = honor.bulan as keyof Prisma.HonorUpdateInput;
            
            const updateData: any = {};
            updateData[bulanKey] = {
                increment: honor.total_jumlah,
            };

            return this.prisma.honor.upsert({
                where: {
                    // Gunakan nama unik yang sesuai dengan skema
                    sobatId_tahun: {
                        sobatId: honor.sobatId, // Akses properti yang benar
                        tahun: honor.tahun,
                    }
                },
                create: {
                    sobatId: honor.sobatId, // Akses properti yang benar
                    tahun: honor.tahun,
                    [bulanKey]: honor.total_jumlah,
                },
                update: updateData,
            });
        })
    );
    }
    else {
    const sobatId = data.id_sobat;
    const bulan = String(data.bulan).toLowerCase();
    const bulanKey = bulan as keyof Prisma.HonorUpdateInput;

    const updateData: any = {};
    updateData[bulanKey] = {
      increment: data.jumlah,
    };

    await this.prisma.honor.upsert({
      where: {
        sobatId_tahun: {
          sobatId: sobatId,
          tahun: data.tahun,
        },
      },
      create: {
        sobatId: sobatId,
        tahun: data.tahun,
        [bulanKey]: data.jumlah,
      },
      update: updateData,
    });
  }
}

  async generateUniqHash(data: {
  bulan: string;
  tanggal: string;
  tim?: string;
  nama_survei: string;
  nama_survei_sobat?: string;
  kegiatan?: string;
  tahun: number;
}): Promise<string> {
  const key = `${data.bulan}|${data.tanggal}|${data.tim || ''}|${data.nama_survei}|${data.nama_survei_sobat || ''}|${data.kegiatan || ''}|${data.tahun}`;
  return crypto.createHash('md5').update(key).digest('hex');
}

async uploadExcelFile(file: Express.Multer.File): Promise<any> {
  const workbook = XLSX.read(file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const dataToProcess: any[] = XLSX.utils.sheet_to_json(worksheet);

  if (dataToProcess.length === 0) {
    return {
      statusCode: 500,
      message: 'Data kosong. Tambahkan baris.',
    };
  }

  const dataWithMissingId = dataToProcess.filter(row => !row['ID SOBAT']);
    if (dataWithMissingId.length > 0) {
      throw new BadRequestException('Terdapat data dengan ID Sobat yang kosong. Mohon periksa kembali file Anda.');
    } 
    const uniqueSobatIds = [...new Set(dataToProcess.map(row => String(row['ID SOBAT'])))];

const existingMitras = await this.prisma.mitra.findMany({
  where: { 
    sobatId: { in: uniqueSobatIds },
  },
  select: { sobatId: true },
});
    const existingSobatIdSet = new Set(existingMitras.map(m => m.sobatId));

    const nonExistingSobatIds = uniqueSobatIds.filter(id => !existingSobatIdSet.has(id));
    if (nonExistingSobatIds.length > 0) {
      throw new BadRequestException(`ID Sobat berikut tidak ditemukan di database: ${nonExistingSobatIds.join(', ')}`);
    }

    return dataToProcess;
  }

async processExcelFile(dataToProcess): Promise<any> {

  const kegiatanData = await Promise.all(
    dataToProcess.map(async (row) => {
      const base = {
        bulan: String(row['BULAN LAPANGAN'] || ''),
        tanggal: String(row['TANGGAL LAPANGAN'] || ''),
        tim: String(row['TIM'] || ''),
        nama_survei: String(row['NAMA SURVEI'] || ''),
        nama_survei_sobat: String(row['NAMA SURVEI SOBAT'] || ''),
        kegiatan: String(row['KEGIATAN'] || ''),
        tahun: 2025,
      };
      return {
        ...base,
        kodeKegiatan: await this.generateUniqHash(base),
      };
    })
  );

  await this.prisma.kegiatan.createMany({
    data: kegiatanData,
    skipDuplicates: true
  });

  const createdKegiatan = await this.prisma.kegiatan.findMany({
    select: {
      kodeKegiatan: true,
      bulan: true,
      tanggal: true,
      tim: true,
      nama_survei: true,
      nama_survei_sobat: true,
      kegiatan: true,
    },
  });

  const kegiatanMap = new Map<string, string>();
  createdKegiatan.forEach(keg => {
    const key = `${keg.bulan}-${keg.tanggal}-${keg.tim}-${keg.nama_survei}-${keg.nama_survei_sobat}-${keg.kegiatan}`;
    kegiatanMap.set(key, keg.kodeKegiatan);
  });

  const validData: Prisma.KegiatanMitraCreateManyInput[] = dataToProcess.map((row) => {
    const key = `${String(row['BULAN LAPANGAN'] || '')}-${String(row['TANGGAL LAPANGAN'] || '')}-${String(row['TIM'] || '')}-${String(row['NAMA SURVEI'] || '')}-${String(row['NAMA SURVEI SOBAT'] || '')}-${String(row['KEGIATAN'] || '')}`;
    const kegiatanId = kegiatanMap.get(key) || null;

    return {
      bulan: String(row['BULAN LAPANGAN'] || ''),
      tanggal: String(row['TANGGAL LAPANGAN'] || ''),
      tim: String(row['TIM'] || ''),
      nama_survei: String(row['NAMA SURVEI'] || ''),
      nama_survei_sobat: String(row['NAMA SURVEI SOBAT'] || ''),
      kegiatan: String(row['KEGIATAN'] || ''),
      pcl_pml_olah: String(row['PCL/PML/OLAH'] || ''),
      nama_petugas: String(row['NAMA PETUGAS'] || ''),
      id_sobat: String(row['ID SOBAT'] || ''),
      satuan: String(row['SATUAN'] || ''),
      volum: parseInt(row['VOLUME'] || 0),
      harga_per_satuan: parseFloat(row['HARGA PER SATUAN'] || 0),
      jumlah: parseFloat(row['JUMLAH'] || 0),
      konfirmasi: String(row['KETERANGAN/STATUS KONFIRMASI'] || ''),
      flag_sobat: String(row['FLAG SOBAT'] || ''),
      tahun: 2025,
      kegiatanId: kegiatanId
    };
  });

  const result = await this.prisma.kegiatanMitra.createMany({
    data: validData,
    skipDuplicates: true
  });

  await this.updateHonorPerBulan(validData);

  return {
    statusCode: 200,
    message: `${result.count} data berhasil diunggah dan disimpan.`,
    data: result,
  };
}
}
