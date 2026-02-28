import { TypeKegiatan } from '@prisma/client';
export declare class KegiatanDto {
    id: number;
    bulan: string;
    get bulan_angka(): number;
    tanggal: string;
    tim: string;
    nama_survei: string;
    nama_survei_sobat: string;
    kegiatan: string;
    tahun: number;
    kodeKegiatan: string;
    judul?: TypeKegiatan;
    jenis_kegiatan?: TypeKegiatan;
    hari: string;
    tanggal_mulai: Date;
    hari_selesai: string;
    tanggal_selesai: Date;
}
