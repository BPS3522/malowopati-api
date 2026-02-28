import type { Response } from 'express';
import { FilesService } from './files.service';
import { FileUploadDto, FileResponseDto } from './dto/file.dto';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    uploadFile(file: Express.Multer.File, fileUploadDto: FileUploadDto): Promise<FileResponseDto>;
    uploadMultipleFiles(files: Express.Multer.File[], fileUploadDto: FileUploadDto): Promise<{
        status_code: number;
        message: string;
        data: FileResponseDto[];
    }>;
    downloadFile(filename: string, res: Response): Promise<void>;
    getFileInfo(filename: string): Promise<FileResponseDto>;
    listFiles(): Promise<FileResponseDto[]>;
    streamFile(filename: string, res: Response): Promise<void>;
}
