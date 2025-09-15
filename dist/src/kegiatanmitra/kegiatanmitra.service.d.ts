import { PrismaService } from '../prisma/prisma.service';
import { KegiatanMitraDto } from './dto/kegiatanmitra.dto';
import { Prisma } from '@prisma/client';
export declare class KegiatanmitraService {
    private prisma;
    constructor(prisma: PrismaService);
    getKegiatanMitra(): Promise<({
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
            harga_per_satuan: Prisma.Decimal | null;
            jumlah: Prisma.Decimal | null;
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
    })[]>;
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
            harga_per_satuan: Prisma.Decimal | null;
            jumlah: Prisma.Decimal | null;
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
    countKegiatanMitra(year: number): Promise<{
        id: number;
        namaLengkap: string;
        jumlahKegiatan: number;
    }[]>;
    createKegiatanMitra(dto: KegiatanMitraDto): Promise<{
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
        harga_per_satuan: Prisma.Decimal | null;
        jumlah: Prisma.Decimal | null;
    }>;
    deleteKegiatanMitra(id: number): Promise<{
        status: string;
        message: string;
    }>;
    updateHonorBulanTertentu(id_sobat: string, bulan: string, tahun: number): Promise<void>;
    updateHonorPerBulan(data: any[] | KegiatanMitraDto): Promise<void>;
    generateUniqHash(data: {
        bulan: string;
        tanggal: string;
        tim?: string;
        nama_survei: string;
        nama_survei_sobat?: string;
        kegiatan?: string;
        tahun: number;
    }): Promise<string>;
    uploadExcelFile(file: Express.Multer.File): Promise<any>;
    processExcelFile(dataToProcess: any): Promise<any>;
}
