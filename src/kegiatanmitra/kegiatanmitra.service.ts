import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { KegiatanMitraDto } from './dto/create-kegiatan-mitra.dto';
import * as XLSX from 'xlsx';
import { Decimal } from '@prisma/client/runtime/binary';
import { Prisma, TypeKegiatan } from '@prisma/client';
import * as crypto from 'crypto';
import { FiltersService } from 'src/filters/filters.service';
import {
  Alokasi,
  Bulan,
  Flag_Sobat,
  Harga_Persatuan,
  Hari,
  Hari_Selesai,
  Id_Sobat,
  Jenis_Kegiatan,
  Judul,
  Jumlah,
  Kecamatan,
  Konfirmasi,
  Nama_Mitra,
  Nama_Survei,
  Nama_Survei_Sobat,
  No_Kontrak_BAST,
  No_Kontrak_SPK,
  No_Urut_Mitra,
  PCL_PML_OLAH,
  Satuan_Alokasi,
  Tahun,
  Tanggal,
  Tanggal_Mulai,
  Tanggal_Selesai,
  Tim,
} from './enum/kolom-excel.enum';

@Injectable()
export class KegiatanmitraService {
  constructor(
    private prisma: PrismaService,
    private readonly filtersService: FiltersService,
  ) {}

  async getKegiatanMitra(filters: any) {
    const { month, year, tim } = filters;

    const result = await this.prisma.kegiatan.findMany({
      where: {
        ...(month ? { bulan: month } : {}),
        ...(year ? { tahun: Number(year) } : {}),
        ...(tim ? { tim: tim } : {}),
      },
      include: {
        mitra: {
          include: {
            mitra: true,
          },
        },
      },
    });
    return result;
  }

  async getKegiatanMitraById(filters: any) {
    const { id, tahun, bulan } = filters;

    const result = await this.prisma.mitra.findUnique({
      where: { id },
      include: {
        KegiatanMitra: {
          where: {
            ...(tahun ? { tahun: Number(tahun) } : {}),
            ...(bulan ? { bulan: bulan } : {}),
          },
        },
      },
    });
    return result;
  }

  async downloadKegiatanMitra(filters: any) {
    const { columns, sortBy, sortOrder, filterBy } = filters;
    const direction = sortOrder === 'asc' ? 'asc' : 'desc';
    const data = await this.prisma.kegiatanMitra.findMany({
      orderBy: { [sortBy || 'id']: direction },
      where: {
        ...(filterBy ? { tahun: { in: filterBy.map(Number) } } : {}),
      },
      select: {
        id: true,
        kegiatanMaster: true,
        mitra: {
          select: {
            sobatId: true,
            ...(columns?.includes('jenisKelamin') ? { jenisKelamin: true } : {}),
          },
        },
        ...(columns?.includes('nama_petugas') ? { nama_petugas: true } : {}),
        ...(columns?.includes('id_sobat') ? { id_sobat: true } : {}),
        ...(columns?.includes('satuan') ? { satuan: true } : {}),
        ...(columns?.includes('volum') ? { volum: true } : {}),
        ...(columns?.includes('harga_per_satuan') ? { harga_per_satuan: true } : {}),
        ...(columns?.includes('jumlah') ? { jumlah: true } : {}),
        ...(columns?.includes('no_kontrak_spk') ? { no_kontrak_spk: true } : {}),
        ...(columns?.includes('no_kontrak_bast') ? { no_kontrak_bast: true } : {}),
        ...(columns?.includes('no_urut_mitra') ? { no_urut_mitra: true } : {}),
        ...(columns?.includes('kecamatan') ? { kecamatan: true } : {}),
      },
    });

    return data.map(({ kegiatanMaster, mitra, ...rest }) => ({
      ...rest,
      ...mitra,
      ...kegiatanMaster,
    }));
  }

  async countMitraKegiatanHonor(filters: any) {
    const { year, month, idSobat } = filters;

    const query: Prisma.MitraFindManyArgs = {
      where: {
        ...(idSobat ? { sobatId: idSobat } : {}),
      },
      include: {
        KegiatanMitra: {
          where: {
            ...(idSobat ? { id_sobat: idSobat } : {}),
            ...(year ? { tahun: Number(year) } : {}),
            ...(month ? { bulan: month } : {}),
          },
        },
        honors: {
          where: {
            ...(year ? { tahun: Number(year) } : {}),
            ...(idSobat ? { sobatId: idSobat } : {}),
          },
        },
        _count: {
          select: {
            KegiatanMitra: {
              where: {
                ...(idSobat ? { id_sobat: idSobat } : {}),
                ...(year ? { tahun: Number(year) } : {}),
                ...(month ? { bulan: month } : {}),
              },
            },
            honors: {
              where: {
                ...(idSobat ? { sobatId: idSobat } : {}),
                ...(year ? { tahun: Number(year) } : {}),
              },
            },
          },
        },
      },
    };

    const kegMitra: Prisma.KegiatanMitraFindManyArgs = {
      where: {
        ...(idSobat ? { id_sobat: idSobat } : {}),
        ...(year ? { tahun: Number(year) } : {}),
        ...(month ? { bulan: month } : {}),
      },
    };

    const honorMitra = await this.prisma.honor.findMany({
      where: {
        ...(idSobat ? { sobatId: idSobat } : {}),
        ...(year ? { tahun: Number(year) } : {}),
      },
    });
    const honorDataWithTotal = honorMitra.map((item) => ({
      total:
        item.januari +
        item.februari +
        item.maret +
        item.april +
        item.mei +
        item.juni +
        item.juli +
        item.agustus +
        item.september +
        item.oktober +
        item.november +
        item.desember,
    }));

    const sumHonor = honorDataWithTotal.reduce((sum, item) => {
      return sum + item.total;
    }, 0);

    const [mitra, countMitra, countKegiatanMitra] = await this.prisma.$transaction([
      this.prisma.mitra.findMany(query),
      this.prisma.mitra.count({ where: query.where }),
      this.prisma.kegiatanMitra.count({ where: kegMitra.where }),
    ]);

    return {
      mitra,
      countMitra,
      countKegiatanMitra,
      sumHonor,
    };
  }

  async countKegiatanMitra(year: number) {
    const dataMitra = await this.prisma.mitra.findMany({
      include: {
        _count: {
          select: {
            KegiatanMitra: {
              where: {
                tahun: year,
              },
            },
          },
        },
      },
    });

    const sortedData = dataMitra.sort((a, b) => {
      return b._count.KegiatanMitra - a._count.KegiatanMitra;
    });

    const formattedData = sortedData.map((mitra) => ({
      id: mitra.id,
      namaLengkap: mitra.namaLengkap,
      jumlahKegiatan: mitra._count.KegiatanMitra,
    }));

    return formattedData;
  }

  async editKegiatanMitra(dto: any) {
    try {
      const kegiatanMitra = await this.prisma.kegiatanMitra.update({
        where: {
          id: dto.id,
        },
        data: dto,
      });
      await this.updateHonorBulanTertentu(
        kegiatanMitra.id_sobat,
        kegiatanMitra.bulan,
        kegiatanMitra.tahun,
      );

      return kegiatanMitra;
    } catch (error) {
      console.error('Detail Error Malowopati:', error);
      throw new BadRequestException({
        statusCode: 500,
        message: 'Gagal mengedit data',
        error: error.message,
      });
    }
  }

  async createKegiatanMitra(dto: KegiatanMitraDto) {
    const dataMitra = await this.prisma.mitra.findUnique({
      where: {
        sobatId: dto.id_sobat,
      },
    });
    if (!dataMitra) {
      throw new NotFoundException(`Mitra dengan ID ${dto.id_sobat} tidak ditemukan.`);
    }

    const dataKegiatan = await this.prisma.kegiatan.findFirst({
      where: {
        kodeKegiatan: dto.kegiatanId,
      },
    });

    if (!dataKegiatan) {
      throw new NotFoundException(`Mitra dengan ID ${dto.kegiatanId} tidak ditemukan.`);
    }

    const result = this.prisma.kegiatanMitra.create({
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
        kegiatanId: dto.kegiatanId,
        kecamatan: dto.kecamatan,
        no_kontrak_spk: dto.no_kontrak_spk,
        no_kontrak_bast: dto.no_kontrak_bast,
        no_urut_mitra: dto.no_urut_mitra,
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
    try {
      await this.prisma.kegiatanMitra.delete({
        where: { id },
      });

      await this.updateHonorBulanTertentu(
        kegiatanMitra.id_sobat,
        kegiatanMitra.bulan,
        kegiatanMitra.tahun,
      );

      return { status: 'success', message: 'Kegiatan mitra berhasil dihapus.' };
    } catch (error) {
      console.error('Detail Error Malowopati:', error);
      throw new BadRequestException({
        statusCode: 400,
        message: 'Gagal menghapus data',
        error: error.message,
      });
    }
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

  async updateHonorPerBulan(data: any[] | any) {
    if (Array.isArray(data) === true) {
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
              },
            },
            create: {
              sobatId: honor.sobatId, // Akses properti yang benar
              tahun: honor.tahun,
              [bulanKey]: honor.total_jumlah,
            },
            update: updateData,
          });
        }),
      );
    } else {
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

  async uploadExcelFile(file: Express.Multer.File): Promise<any> {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: null });

    const dataToProcess = rawData.filter((row) => {
      return Object.values(row).some(
        (value) =>
          value !== null &&
          value !== undefined &&
          String(value).trim() !== '' &&
          String(value).trim() !== '#N/A' &&
          String(value).trim() !== '0',
      );
    });

    if (dataToProcess.length === 0) {
      throw new BadRequestException(
        'Data kosong atau hanya berisi #N/A. Tambahkan baris data yang valid.',
      );
    }

    function isMissingValue(dataToProcess: any[], column: string) {
      return dataToProcess.filter((row) => {
        const key = Object.keys(row).find((k) => k.trim().toLowerCase() === column);
        const value = key ? row[key] : null;

        return (
          value === null ||
          value === undefined ||
          String(value).trim() === '' ||
          String(value).trim() === '#N/A' ||
          String(value).trim() === '0'
        );
      });
    }

    const dataWithMissingYear = isMissingValue(dataToProcess, Tahun);

    if (dataWithMissingYear.length > 0) {
      throw new BadRequestException(
        'Kolom Tahun wajib diisi. Terdapat data kosong atau #N/A pada kolom Tahun.',
      );
    }

    const dataWithMissingId = isMissingValue(dataToProcess, Id_Sobat);

    if (dataWithMissingId.length > 0) {
      throw new BadRequestException(
        'ID Sobat wajib diisi. Terdapat data dengan ID Sobat yang kosong.',
      );
    }

    const uniqueSobatIds = [
      ...new Set(
        dataToProcess
          .map((row) => {
            const key = Object.keys(row).find((k) => k.trim().toLowerCase() === Id_Sobat);

            return key ? String(row[key]) : null;
          })
          .filter((id) => id !== null),
      ),
    ];

    const existingMitras = await this.prisma.mitra.findMany({
      where: {
        sobatId: { in: uniqueSobatIds },
      },
      select: { sobatId: true },
    });
    const existingSobatIdSet = new Set(existingMitras.map((m) => m.sobatId));

    const nonExistingSobatIds = uniqueSobatIds.filter((id) => !existingSobatIdSet.has(id));

    if (nonExistingSobatIds.length > 0) {
      throw new BadRequestException(
        `ID Sobat berikut tidak ditemukan di database: ${nonExistingSobatIds.join(', ')}`,
      );
    }
    return dataToProcess;
  }

  generateKey(obj: any): crypto.BinaryLike {
    const safeLower = (val: any) =>
      String(val ?? '')
        .toLowerCase()
        .trim();

    return [
      obj.bulan,
      obj.bulan_angka,
      obj.tanggal,
      obj.tim,
      obj.nama_survei,
      obj.nama_survei_sobat,
      obj.kegiatan,
      obj.tahun,
      obj.judul,
      obj.jenis_kegiatan,
      obj.hari,
      obj.tanggal_mulai,
      obj.tanggal_selesai,
      obj.hari_selesai,
    ]
      .map(safeLower)
      .join('|');
  }

  async generateUniqHash(data: any): Promise<string> {
    const key = this.generateKey(data);
    return crypto.createHash('md5').update(key).digest('hex');
  }

  async processExcelFile(dataToProcess): Promise<any> {
    const bulanIndo: Record<string, string> = {
      januari: 'January',
      februari: 'February',
      maret: 'March',
      april: 'April',
      mei: 'May',
      juni: 'June',
      juli: 'July',
      agustus: 'August',
      september: 'September',
      oktober: 'October',
      november: 'November',
      desember: 'December',
    };

    const bulanAngka: Record<string, number> = {
      januari: 1,
      februari: 2,
      maret: 3,
      april: 4,
      mei: 5,
      juni: 6,
      juli: 7,
      agustus: 8,
      september: 9,
      oktober: 10,
      november: 11,
      desember: 12,
    };

    const jsonExcel = dataToProcess.map((row) => {
      try {
        // helper
        function findValueRow(row: any, columnName: string) {
          const key = Object.keys(row).find((k) => k.trim().toLowerCase() === columnName);
          return key ? row[key] : null;
        }

        //helpper
        const convertMoon = (bln: string) => {
          const bulan = findValueRow(row, bln) || 'januari';
          return bulanAngka[bulan.toLowerCase()] || 'januari';
        };

        // helper
        const convertDate = (tgl: any, bln: any, thn: any): Date => {
          const tanggal = findValueRow(row, tgl) || '1';
          const bulan = findValueRow(row, bln) || 'January';
          const tahun = findValueRow(row, thn) || 2026;

          const blnEnglish = bulanIndo[bulan.toLowerCase()] || 'January';
          return new Date(`${tahun}-${blnEnglish}-${tanggal}`);
        };

        // helper
        function mapToTypeKegiatan(excelValue: string): TypeKegiatan | null {
          const normalized = excelValue.trim().toUpperCase().replace(/\s+/g, '_');

          const validEnum = [
            String(TypeKegiatan.PENDATAAN_LAPANGAN),
            String(TypeKegiatan.PENGAWASAN_LAPANGAN),
            String(TypeKegiatan.PENGOLAHAN_LAPANGAN),
          ];

          if (validEnum.includes(normalized)) {
            return normalized as TypeKegiatan;
          }

          return 'PENDATAAN_LAPANGAN';
        }

        return {
          bulan: String(findValueRow(row, Bulan) || ''),
          bulan_angka: convertMoon(String(findValueRow(row, Bulan) || 1)),
          tanggal: String(findValueRow(row, Tanggal) || ''),
          tim: String(findValueRow(row, Tim) || ''),
          nama_survei: String(findValueRow(row, Nama_Survei) || ''),
          nama_survei_sobat: String(findValueRow(row, Nama_Survei_Sobat) || ''),
          kegiatan: String(findValueRow(row, Jenis_Kegiatan) || ''),
          pcl_pml_olah: String(findValueRow(row, PCL_PML_OLAH) || ''),
          nama_petugas: String(findValueRow(row, Nama_Mitra) || ''),
          id_sobat: String(findValueRow(row, Id_Sobat) || ''),
          satuan: String(findValueRow(row, Satuan_Alokasi) || ''),
          volum: Number(findValueRow(row, Alokasi) || 0),
          harga_per_satuan: Number(findValueRow(row, Harga_Persatuan) || 0),
          jumlah: Number(
            findValueRow(row, Jumlah) ||
              Number(findValueRow(row, Alokasi) || 1) *
                Number(findValueRow(row, Harga_Persatuan) || 1),
          ),
          konfirmasi: String(findValueRow(row, Konfirmasi) || ''),
          flag_sobat: String(findValueRow(row, Flag_Sobat) || ''),
          no_urut_mitra: Number(findValueRow(row, No_Urut_Mitra) || 0),
          tahun: Number(findValueRow(row, Tahun) || 0),
          judul: String(mapToTypeKegiatan(findValueRow(row, Judul) || '')),
          no_kontrak_spk: String(findValueRow(row, No_Kontrak_SPK) || ''),
          no_kontrak_bast: String(findValueRow(row, No_Kontrak_BAST) || ''),
          hari: String(findValueRow(row, Hari) || ''),
          tanggal_mulai: convertDate(
            String(findValueRow(row, Tanggal_Mulai) || 1),
            String(findValueRow(row, Bulan) || 'January'),
            Number(findValueRow(row, Tahun) || 0),
          ),
          hari_selesai: String(findValueRow(row, Hari_Selesai) || ''),
          tanggal_selesai: convertDate(
            String(findValueRow(row, Tanggal_Selesai) || 1),
            String(findValueRow(row, Bulan) || 'February'),
            Number(findValueRow(row, Tahun) || 0),
          ),
          // no_urut_mitra: Number(Object.keys(row).find(k => k.trim().toLowerCase() === 'no urut mitra') || 0),
          jenis_kegiatan: String(mapToTypeKegiatan(findValueRow(row, Jenis_Kegiatan) || '')),
          kecamatan: String(findValueRow(row, Kecamatan) || ''),
        };
      } catch (error) {
        console.error('Detail Error Malowopati:', error);
        throw new BadRequestException({
          statusCode: 400,
          message: 'Gagal menyimpan data. Silakan cek konsol atau hubungi admin.',
          error: error.message,
        });
      }
    });

    let kegiatanData: any[] = [];
    kegiatanData = await Promise.all(
      jsonExcel.map(async (row) => {
        try {
          let tahunRecord = await this.filtersService.findTahun(row.tahun);

          if (!tahunRecord) {
            tahunRecord = await this.filtersService.createTahun(row.tahun);
          }

          return {
            bulan: row.bulan,
            bulan_angka: row.bulan_angka,
            tanggal: row.tanggal,
            tim: row.tim,
            nama_survei: row.nama_survei,
            nama_survei_sobat: row.nama_survei_sobat,
            kegiatan: row.kegiatan,
            tahun: tahunRecord.year,
            judul: row.judul,
            jenis_kegiatan: row.jenis_kegiatan,
            hari: row.hari,
            tanggal_mulai: row.tanggal_mulai,
            hari_selesai: row.hari_selesai,
            tanggal_selesai: row.tanggal_selesai,
            kodeKegiatan: await this.generateUniqHash(row),
          };
        } catch (error) {
          console.error('Detail Error Malowopati:', error);
          throw new BadRequestException({
            statusCode: 400,
            message: 'Gagal menyimpan data. Silakan cek konsol atau hubungi admin.',
            error: error.message,
          });
        }
      }),
    );

    // helper
    function generateKey(obj: any): string {
      return `${obj.bulan}-
            ${obj.bulan_angka}-
            ${obj.tanggal}-
            ${obj.tim}-
            ${obj.nama_survei}-
            ${obj.nama_survei_sobat}-
            ${obj.kegiatan}-
            ${obj.tahun}-
            ${obj.judul}-
            ${obj.jenis_kegiatan}-
            ${obj.hari}-
            ${obj.tanggal_mulai}-
            ${obj.hari_selesai}-
            ${obj.tanggal_selesai}
            `;
    }

    try {
      const kodeKegiatanMap = new Map<string, string>();
      kegiatanData.forEach((keg) => {
        const key = generateKey(keg);
        kodeKegiatanMap.set(key, keg.kodeKegiatan);
      });

      await this.prisma.kegiatan.createMany({
        data: kegiatanData,
        skipDuplicates: true,
      });

      const validData: Prisma.KegiatanMitraCreateManyInput[] = jsonExcel.map((row) => {
        const key = generateKey(row);
        const kegiatanId = kodeKegiatanMap.get(key) || null;
        return {
          bulan: row.bulan,
          tanggal: row.tanggal,
          tim: row.tim,
          nama_survei: row.nama_survei,
          nama_survei_sobat: row.nama_survei_sobat,
          kegiatan: row.kegiatan,
          pcl_pml_olah: row.pcl_pml_olah,
          nama_petugas: row.nama_petugas,
          id_sobat: row.id_sobat,
          satuan: row.satuan,
          volum: row.volum,
          harga_per_satuan: row.harga_per_satuan,
          jumlah: row.jumlah,
          konfirmasi: row.konfirmasi,
          flag_sobat: row.flag_sobat,
          tahun: row.tahun,
          kegiatanId: kegiatanId,
          no_kontrak_spk: row.no_kontrak_spk,
          no_kontrak_bast: row.no_kontrak_bast,
          no_urut_mitra: row.no_urut_mitra,
          kecamatan: row.kecamatan,
        };
      });

      const result = await this.prisma.kegiatanMitra.createMany({
        data: validData,
        skipDuplicates: true,
      });

      await this.updateHonorPerBulan(validData);

      return {
        statusCode: 200,
        message: `${result.count} data berhasil disimpan di sistem Malowopati.`,
        data: result,
      };
    } catch (error) {
      console.error('Detail Error Malowopati:', error);
      throw new BadRequestException({
        statusCode: 400,
        message: 'Gagal menyimpan data. Silakan cek konsol atau hubungi admin.',
        error: error.message,
      });
    }
  }
}
