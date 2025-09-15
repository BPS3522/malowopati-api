import { PrismaService } from '../prisma/prisma.service';
export declare class BatashonorService {
    private prisma;
    constructor(prisma: PrismaService);
    getBatasHonorService(): Promise<{
        id: number;
        nama_posisi: string;
        biaya: number;
        keterangan: string | null;
        flag: number | null;
    }[]>;
}
