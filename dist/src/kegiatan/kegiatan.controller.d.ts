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
            tahun: number;
            judul: import("@prisma/client").$Enums.TypeKegiatan | null;
            hari: string | null;
            tanggal_mulai: Date | null;
            bulan: string;
            bulan_angka: number | null;
            hari_selesai: string | null;
            tanggal_selesai: Date | null;
            jenis_kegiatan: import("@prisma/client").$Enums.TypeKegiatan | null;
            tim: string | null;
            nama_survei: string;
            nama_survei_sobat: string | null;
            tanggal: string | null;
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
    deleteKegiatan(id: string): Promise<{
        id: number;
        kegiatan: string | null;
        tahun: number;
        judul: import("@prisma/client").$Enums.TypeKegiatan | null;
        hari: string | null;
        tanggal_mulai: Date | null;
        bulan: string;
        bulan_angka: number | null;
        hari_selesai: string | null;
        tanggal_selesai: Date | null;
        jenis_kegiatan: import("@prisma/client").$Enums.TypeKegiatan | null;
        tim: string | null;
        nama_survei: string;
        nama_survei_sobat: string | null;
        tanggal: string | null;
        kodeKegiatan: string;
    }>;
}
