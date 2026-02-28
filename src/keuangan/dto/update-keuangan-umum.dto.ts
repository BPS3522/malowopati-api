import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateKeuangaByUmumDto {
  @IsString()
  @IsNotEmpty()
  rekap_bos: string;

  @IsString()
  @IsNotEmpty()
  realisasi_bos: string;
}
