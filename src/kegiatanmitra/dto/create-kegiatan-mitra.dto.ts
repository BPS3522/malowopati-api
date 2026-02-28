import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class KegiatanMitraDto {
  @IsOptional()
  id: number;

  @IsString()
  @IsOptional()
  pcl_pml_olah: string;

  @IsString()
  @IsOptional()
  nama_petugas: string;

  @IsString()
  @IsNotEmpty()
  kegiatanId: string;

  @IsString()
  @IsNotEmpty()
  id_sobat: string;

  @IsString()
  @IsOptional()
  satuan: string;

  @IsString()
  @IsOptional()
  flag_sobat: string;

  @IsNumber()
  @IsOptional()
  volum: number;

  @IsNumber()
  @IsOptional()
  harga_per_satuan: number;

  @IsNumber()
  @IsOptional()
  jumlah: number;

  @IsString()
  @IsOptional()
  konfirmasi: string;

  @IsString()
  @IsOptional()
  no_kontrak_spk: string;

  @IsString()
  @IsOptional()
  no_kontrak_bast: string;

  @IsNumber()
  @IsOptional()
  no_urut_mitra: number;

  @IsString()
  @IsOptional()
  kecamatan: string;
  
}
