import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import csv from 'csv-parser';
import * as XLSX from 'xlsx';

interface MitraInput {
  namaLengkap: string;
  posisi: string;
  statusSeleksi: string;
  posisiDaftar: string;
  alamatDetail: string;
  alamatProv: number;
  alamatKab: number;
  alamatKec: number;
  alamatDesa: number;
  tempatTanggalLahir: string;
  jenisKelamin: string;
  pendidikan: string;
  pekerjaan: string;
  deskripsiPekerjaan: string | null;
  noTelp: string;
  sobatId: string;
  email: string;
}

@Injectable()
export class MitraService {
  constructor(private prisma: PrismaService) {}

  async getMitra(sortBy: string = 'id', sortOrder: 'asc' | 'desc' = 'asc') {
    return this.prisma.mitra.findMany({
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
  }

  async processUploadFile(file: Express.Multer.File, tahun: number) {
    try {
      console.log('Processing file year:', tahun);

      let mitraData: MitraInput[] = [];

      if (file.mimetype.includes('csv') || file.originalname.endsWith('.csv')) {
        mitraData = await this.parseFile(file.path, 'csv');
      } else {
        mitraData = await this.parseFile(file.path, 'excel');
      }

      if (mitraData.length === 0) {
        throw new BadRequestException('No valid data found');
      }

      const uniqueData = this.removeDuplicates(mitraData);

      let inserted = 0;
      let updated = 0;

      for (const item of uniqueData) {
        const existing = await this.prisma.mitra.findFirst({
          where: {
            OR: [{ sobatId: item.sobatId }, { namaLengkap: item.namaLengkap }],
          },
        });

        if (!existing) {
          await this.prisma.mitra.create({
            data: {
              ...item,
              tahun: [tahun],
            },
          });

          inserted++;
        } else {
          const tahunLama = existing.tahun || [];

          const tahunBaru = tahunLama.includes(tahun)
            ? tahunLama
            : [...tahunLama, tahun];

          await this.prisma.mitra.update({
            where: { id: existing.id },
            data: {
              ...item,
              tahun: tahunBaru,
            },
          });

          updated++;
        }
      }

      fs.unlinkSync(file.path);

      return {
        inserted,
        updated,
        total: await this.prisma.mitra.count(),
      };
    } catch (error) {
      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      throw new BadRequestException(`Error processing file: ${error.message}`);
    }
  }

  private async parseFile(
    filePath: string,
    type: 'csv' | 'excel',
  ): Promise<MitraInput[]> {
    let rawData: any[][] = [];
    let headers: string[] = [];

    if (type === 'csv') {
      rawData = await this.parseCSVToArray(filePath);
      headers = rawData[0] || [];
    } else {
      const workbook = XLSX.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      rawData = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: '',
      });

      headers = rawData[0] || [];
    }

    if (rawData.length < 2) return [];

    const results: MitraInput[] = [];

    const headerMap: any = {};
    headers.forEach((h, i) => {
      headerMap[h] = i;
    });

    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];

      if (!row || row.every((c) => !c)) continue;

      const nama = this.getCellValue(row, headerMap['Nama Lengkap']);

      if (!nama) continue;

      results.push({
        namaLengkap: nama,
        posisi: this.getCellValue(row, headerMap['Posisi']),
        statusSeleksi: this.getCellValue(
          row,
          headerMap['Status Seleksi (1=Terpilih, 2=Tidak Terpilih)'],
        ),
        posisiDaftar: this.getCellValue(row, headerMap['Posisi Daftar']),
        alamatDetail: this.getCellValue(row, headerMap['Alamat Detail']),
        alamatProv: this.parseNumber(
          this.getCellValue(row, headerMap['Alamat Prov']),
        ),
        alamatKab: this.parseNumber(
          this.getCellValue(row, headerMap['Alamat Kab']),
        ),
        alamatKec: this.parseNumber(
          this.getCellValue(row, headerMap['Alamat Kec']),
        ),
        alamatDesa: this.parseNumber(
          this.getCellValue(row, headerMap['Alamat Desa']),
        ),
        tempatTanggalLahir: this.getCellValue(
          row,
          headerMap['Tempat, Tanggal Lahir (Umur)*'],
        ),
        jenisKelamin: this.getCellValue(row, headerMap['Jenis Kelamin']),
        pendidikan: this.getCellValue(row, headerMap['Pendidikan']),
        pekerjaan: this.getCellValue(row, headerMap['Pekerjaan']),
        deskripsiPekerjaan:
          this.getCellValue(row, headerMap['Deskripsi Pekerjaan Lain']) || null,
        noTelp: this.cleanPhoneNumber(
          this.getCellValue(row, headerMap['No Telp']),
        ),
        sobatId: this.cleanSobatId(this.getCellValue(row, headerMap['SOBAT ID'])),
        email: this.getCellValue(row, headerMap['Email']),
      });
    }

    return results;
  }

  private parseCSVToArray(filePath: string): Promise<any[][]> {
    return new Promise((resolve, reject) => {
      const results: any[][] = [];
      let headers: string[] = [];

      fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('headers', (h) => {
          headers = h;
          results.push(h);
        })
        .on('data', (data) => {
          const row = headers.map((h) => data[h]);
          results.push(row);
        })
        .on('end', () => resolve(results))
        .on('error', (err) => reject(err));
    });
  }

  private removeDuplicates(data: MitraInput[]): MitraInput[] {
    const map = new Map();

    for (const item of data) {
      const key = item.sobatId || item.namaLengkap;

      if (!map.has(key)) {
        map.set(key, item);
      }
    }

    return Array.from(map.values());
  }

  private getCellValue(row: any[], index: number): string {
    if (index === undefined || index < 0) return '';
    const val = row[index];
    return val ? String(val).trim() : '';
  }

  private parseNumber(value: any): number {
    if (!value) return 0;
    const cleaned = String(value).replace(/[^0-9]/g, '');
    const num = parseInt(cleaned);
    return isNaN(num) ? 0 : num;
  }

  private cleanPhoneNumber(value: any): string {
    if (!value) return '';
    return String(value).replace(/[^0-9]/g, '');
  }

  private cleanSobatId(value: any): string {
    if (!value) return '';

    let str = String(value).trim();

    if (str.includes('E+')) {
      const num = parseFloat(str);
      str = num.toFixed(0);
    }

    str = str.replace(/[^0-9]/g, '');

    if (!str || str.length < 5) {
      str = `SOBAT${Math.random().toString(36).substring(2, 8)}`;
    }

    return str;
  }

  async updateMitra(id: number, data: any) {
    return this.prisma.mitra.update({
      where: { id },
      data,
    });
  }

  async deleteMitra(id: number) {
    return this.prisma.mitra.delete({
      where: { id },
    });
  }
}