import { IsOptional, isString, IsString } from 'class-validator';

export class BatasHonorDto {
  id: number;

  @IsString()
  nama_posisi: string;

  biaya: number;

  @IsString()
  @IsOptional()
  keterangan: string;

  @IsOptional()
  flag: number;
}
