import { PrismaService } from '../prisma/prisma.service';
export declare class MitraService {
    private prisma;
    constructor(prisma: PrismaService);
    getMitra(): Promise<{
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
    }[]>;
}
