import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateKeuangaByBendaharaDto {
  @IsString()
  @IsNotEmpty()
  bendahara_bayar: string;

  @IsString()
  @IsNotEmpty()
  no_spp: string;

  @IsString()
  @IsNotEmpty()
  tanggal_spp: Date;
}
