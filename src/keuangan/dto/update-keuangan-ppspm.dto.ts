import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateKeuangaByPPSPMDto {
  @IsString()
  @IsNotEmpty()
  ppspm_cek_dokumen: string;

  @IsString()
  @IsNotEmpty()
  ppspm_kirim_ke_bendahara: Date;
}
