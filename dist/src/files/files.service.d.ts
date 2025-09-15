import { Response } from 'express';
import { FileResponseDto } from '../dto/file.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class FilesService {
    private prisma;
    private readonly uploadPath;
    constructor(prisma: PrismaService);
    saveFileMetadata(file: Express.Multer.File, description?: string): Promise<FileResponseDto>;
    getFilePath(filename: string): Promise<string>;
    getFileInfo(filename: string): Promise<FileResponseDto>;
    getAllFiles(): Promise<FileResponseDto[]>;
    streamFile(filename: string, res: Response): Promise<void>;
}
