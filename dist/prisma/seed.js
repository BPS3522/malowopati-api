"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const bcrypt = __importStar(require("bcrypt-ts"));
const prisma = new client_1.PrismaClient();
async function main() {
    const mitraResults = [];
    const kegiatanResults = [];
    const batasHonorResults = [];
    const mitraPromise = new Promise((resolve, reject) => {
        fs_1.default.createReadStream('prisma/mitra.csv')
            .pipe((0, csv_parser_1.default)({ separator: ';' }))
            .on('data', (data) => {
            mitraResults.push({
                namaLengkap: data['Nama Lengkap'],
                posisi: data['Posisi'],
                statusSeleksi: data['Status Seleksi (1=Terpilih, 2=Tidak Terpilih)'],
                posisiDaftar: data['Posisi Daftar'],
                alamatDetail: data['Alamat Detail'],
                alamatProv: parseInt(data['Alamat Prov']) || 0,
                alamatKab: parseInt(data['Alamat Kab']) || 0,
                alamatKec: parseInt(data['Alamat Kec']) || 0,
                alamatDesa: parseInt(data['Alamat Desa']) || 0,
                tempatTanggalLahir: data['Tempat, Tanggal Lahir (Umur)*'],
                jenisKelamin: data['Jenis Kelamin'],
                pendidikan: data['Pendidikan'],
                pekerjaan: data['Pekerjaan'],
                deskripsiPekerjaan: data['Deskripsi Pekerjaan Lain'] || null,
                noTelp: data['No Telp'],
                sobatId: data['SOBAT ID'],
                email: data['Email'],
            });
        })
            .on('end', async () => {
            if (mitraResults.length > 0) {
                await prisma.mitra.createMany({
                    data: mitraResults,
                    skipDuplicates: true
                });
                console.log('✅ Seed Mitra selesai.');
            }
            resolve();
        })
            .on('error', reject);
    });
    async function usersSeed() {
        const usersSeed = [
            {
                username: 'bpsbojonegoro',
                password: await bcrypt.hash("statistik3522", 10)
            },
            {
                username: 'bendahara',
                password: await bcrypt.hash("statistik3522", 10)
            },
            {
                username: 'umum',
                password: await bcrypt.hash("statistik3522", 10)
            },
            {
                username: 'ppk',
                password: await bcrypt.hash("statistik3522", 10)
            },
            {
                username: 'ppspm',
                password: await bcrypt.hash("statistik3522", 10)
            }
        ];
        try {
            await prisma.users.deleteMany();
            const result = await prisma.users.createMany({
                data: usersSeed,
            });
            console.log(`Seeding complete. ${result.count} users created.`);
        }
        catch (e) {
            console.error('Seeding failed:', e);
        }
        finally {
            console.log('✅ Seed Users selesai.');
            await prisma.$disconnect();
        }
    }
    usersSeed();
    await Promise.all([mitraPromise]);
}
main()
    .catch((e) => {
    console.error(e);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map