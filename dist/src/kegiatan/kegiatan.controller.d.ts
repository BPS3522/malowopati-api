import { KegiatanService } from './kegiatan.service';
import { KegiatanDto } from './dto/kegiatan.dto';
export declare class KegiatanController {
    private readonly kegiatanService;
    constructor(kegiatanService: KegiatanService);
    createKegiatanMitra(kegiatanDto: KegiatanDto): Promise<{
        status_code: number;
        message: string;
        data: {
            id: number;
            kegiatan: string | null;
            bulan: string;
            tanggal: string;
            tim: string | null;
            nama_survei: string;
            nama_survei_sobat: string | null;
            tahun: number;
            kodeKegiatan: string;
        };
    }>;
    getRekapKegiatan(tahun: string): Promise<{
        bulan: string;
        kegiatan: any;
    }[]>;
    getRekapKegiatanByTim(year?: string, month?: string, idSobat?: string): Promise<{
        grouped: {
            id: string;
            label: string;
            value: number;
        }[];
        total: number;
    }>;
    deleteJawaban(id: string): Promise<{
        status_code: number;
        message: string;
    }>;
}
