import { PrismaService } from '../prisma/prisma.service';
import { KegiatanDto } from './dto/kegiatan.dto';
import { KegiatanmitraService } from 'src/kegiatanmitra/kegiatanmitra.service';
import { FiltersService } from 'src/filters/filters.service';
export declare class KegiatanService {
    private prisma;
    private readonly kegiatanmitraService;
    private readonly filtersService;
    constructor(prisma: PrismaService, kegiatanmitraService: KegiatanmitraService, filtersService: FiltersService);
    createKegiatan(dto: KegiatanDto): Promise<{
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
    getKegiatanById(id: number): Promise<({
        mitra: {
            id: number;
            kegiatan: string | null;
            tahun: number;
            pcl_pml_olah: string | null;
            nama_petugas: string | null;
            kegiatanId: string | null;
            id_sobat: string;
            satuan: string | null;
            flag_sobat: string | null;
            volum: number | null;
            harga_per_satuan: import("@prisma/client/runtime/library").Decimal | null;
            jumlah: import("@prisma/client/runtime/library").Decimal | null;
            konfirmasi: string | null;
            no_kontrak_spk: string | null;
            no_kontrak_bast: string | null;
            no_urut_mitra: number | null;
            kecamatan: string | null;
            bulan: string;
            tim: string;
            nama_survei: string;
            nama_survei_sobat: string | null;
            tanggal: string | null;
        }[];
    } & {
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
    }) | null>;
    deleteKegiatan(id: number): Promise<{
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
    getRekapKegiatan(tahun: number): Promise<{
        bulan: string;
        kegiatan: any;
    }[]>;
    getKegiatanByTim(filters: any): Promise<{
        grouped: {
            id: string;
            label: string;
            value: number;
        }[];
        total: number;
    }>;
}
