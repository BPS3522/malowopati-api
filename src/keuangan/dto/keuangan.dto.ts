import { IsDateString, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class KeuanganDto {
  @IsString()
  @IsNotEmpty()
  tim: string;

  @IsString()
  @IsNotEmpty()
  bulan_kegiatan: string;

  @IsString()
  @IsNotEmpty()
  group_pok: string;

  @IsString()
  @IsNotEmpty()
  detail: string;

  @IsNumber()
  @IsNotEmpty()
  nomor_permintaan: number;

  @IsString()
  @IsNotEmpty()
  deskripsi: string;

  @IsString()
  @IsNotEmpty()
  nomor_surat: string;

  @IsString()
  @IsNotEmpty()
  tipe_form: string;

  @IsNumber()
  @IsNotEmpty()
  jumlah_usulan: number;

  @IsString()
  @IsNotEmpty()
  dibuat_oleh: string;

  @IsString()
  @IsNotEmpty()
  link_scan: string;

  @IsString()
  @IsNotEmpty()
  bulan_pembayaran: string;

  @IsOptional()
  @IsDateString()
  teknis_kirim_ke_umum?: Date;
}
