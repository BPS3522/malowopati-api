import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TypeKegiatan } from '@prisma/client';
import { Type } from 'class-transformer';

const daftarBulan = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export class KegiatanDto {
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  bulan: string;

  get bulan_angka(): number {
    return daftarBulan.indexOf(this.bulan) + 1;
  }

  @IsString()
  @IsNotEmpty()
  tanggal: string;

  @IsString()
  @IsNotEmpty()
  tim: string;

  @IsString()
  nama_survei: string;

  @IsString()
  nama_survei_sobat: string;

  @IsString()
  kegiatan: string;

  @IsNumber()
  @IsNotEmpty()
  tahun: number;

  @IsString()
  @IsOptional()
  kodeKegiatan: string;

  @IsEnum(TypeKegiatan)
  judul?: TypeKegiatan;

  @IsEnum(TypeKegiatan)
  jenis_kegiatan?: TypeKegiatan;

  @IsString()
  hari: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggal_mulai: Date;

  @IsString()
  hari_selesai: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  tanggal_selesai: Date;
}
