import { KegiatanmitraService } from './kegiatanmitra.service';
import { KegiatanMitraDto } from './dto/kegiatanmitra.dto';
export declare class KegiatanmitraController {
    private readonly KegiatanmitraService;
    constructor(KegiatanmitraService: KegiatanmitraService);
    getKegiatanMitra(): Promise<{
        status_code: number;
        message: string;
        data: ({
            mitra: {
                id: number;
                kegiatan: string | null;
                bulan: string;
                tanggal: string;
                tim: string | null;
                nama_survei: string;
                nama_survei_sobat: string | null;
                pcl_pml_olah: string | null;
                nama_petugas: string | null;
                id_sobat: string;
                satuan: string | null;
                konfirmasi: string | null;
                flag_sobat: string | null;
                kegiatanId: string | null;
                tahun: number;
                volum: number | null;
                harga_per_satuan: import("@prisma/client/runtime/library").Decimal | null;
                jumlah: import("@prisma/client/runtime/library").Decimal | null;
            }[];
        } & {
            id: number;
            kegiatan: string | null;
            bulan: string;
            tanggal: string;
            tim: string | null;
            nama_survei: string;
            nama_survei_sobat: string | null;
            tahun: number;
            kodeKegiatan: string;
        })[];
    }>;
    createKegiatanMitra(createKegiatanMitra: KegiatanMitraDto): Promise<{
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
            pcl_pml_olah: string | null;
            nama_petugas: string | null;
            id_sobat: string;
            satuan: string | null;
            konfirmasi: string | null;
            flag_sobat: string | null;
            kegiatanId: string | null;
            tahun: number;
            volum: number | null;
            harga_per_satuan: import("@prisma/client/runtime/library").Decimal | null;
            jumlah: import("@prisma/client/runtime/library").Decimal | null;
        };
    }>;
    uploadTemplate(file: Express.Multer.File): Promise<{
        status_code: number;
        message: string;
        data: any;
    }>;
    saveValidatedData(data: any): Promise<{
        status_code: number;
        message: string;
        data: any;
    }>;
    countKegiatanMitra(tahun: string): Promise<{
        status_code: number;
        message: string;
        data: {
            id: number;
            namaLengkap: string;
            jumlahKegiatan: number;
        }[];
    }>;
    getKegiatanMitraById(id: number): Promise<({
        KegiatanMitra: {
            id: number;
            kegiatan: string | null;
            bulan: string;
            tanggal: string;
            tim: string | null;
            nama_survei: string;
            nama_survei_sobat: string | null;
            pcl_pml_olah: string | null;
            nama_petugas: string | null;
            id_sobat: string;
            satuan: string | null;
            konfirmasi: string | null;
            flag_sobat: string | null;
            kegiatanId: string | null;
            tahun: number;
            volum: number | null;
            harga_per_satuan: import("@prisma/client/runtime/library").Decimal | null;
            jumlah: import("@prisma/client/runtime/library").Decimal | null;
        }[];
    } & {
        id: number;
        namaLengkap: string;
        posisi: string | null;
        statusSeleksi: string | null;
        posisiDaftar: string | null;
        alamatDetail: string | null;
        alamatProv: number | null;
        alamatKab: number | null;
        alamatKec: number | null;
        alamatDesa: number | null;
        tempatTanggalLahir: string | null;
        jenisKelamin: string | null;
        pendidikan: string | null;
        pekerjaan: string | null;
        deskripsiPekerjaan: string | null;
        noTelp: string | null;
        sobatId: string;
        email: string | null;
    }) | null>;
    deleteKegiatanMitra(kegiatanMitraDto: KegiatanMitraDto): Promise<{
        message: string;
        data: {
            status: string;
            message: string;
        };
    }>;
}
