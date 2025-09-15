import { PrismaService } from '../prisma/prisma.service';
export declare class HonormitraService {
    private prisma;
    constructor(prisma: PrismaService);
    private readonly rupiahFormatter;
    formatRupiah(value: number): string;
    getHonorMitra(search?: string): Promise<{
        total: number;
        id: number;
        namaLengkap: string;
        sobatId: string;
        januari: number;
        februari: number;
        maret: number;
        april: number;
        mei: number;
        juni: number;
        juli: number;
        agustus: number;
        september: number;
        oktober: number;
        november: number;
        desember: number;
    }[]>;
    getRekapHonorPerBulan(selectedYear: number): Promise<{
        bulan: string;
        total: number;
    }[]>;
}
