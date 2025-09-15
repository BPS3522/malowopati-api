import { PrismaService } from '../prisma/prisma.service';
import { KegiatanDto } from './dto/kegiatan.dto';
import { KegiatanmitraService } from 'src/kegiatanmitra/kegiatanmitra.service';
export declare class KegiatanService {
    private prisma;
    private readonly kegiatanmitraService;
    constructor(prisma: PrismaService, kegiatanmitraService: KegiatanmitraService);
    createKegiatan(dto: KegiatanDto): Promise<{
        id: number;
        kegiatan: string | null;
        bulan: string;
        tanggal: string;
        tim: string | null;
        nama_survei: string;
        nama_survei_sobat: string | null;
        tahun: number;
        kodeKegiatan: string;
    }>;
    getRekapKegiatan(tahun: number): Promise<{
        bulan: string;
        kegiatan: any;
    }[]>;
}
