import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateKeuangaByPPKDto {
  @IsString()
  @IsNotEmpty()
  ppk_cek_dokumen: string;

  @IsString()
  @IsNotEmpty()
  ppk_kirim_ke_ppspm: string;
}
