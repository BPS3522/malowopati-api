import { IsString, IsOptional } from 'class-validator';

export class FileResponseDto {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  uploadDate: Date;
  description?: string | null;
}

export class FileUploadDto {
  @IsString()
  @IsOptional()
  description?: string;
}
