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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KegiatanmitraService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const XLSX = __importStar(require("xlsx"));
const binary_1 = require("@prisma/client/runtime/binary");
const crypto = __importStar(require("crypto"));
let KegiatanmitraService = class KegiatanmitraService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getKegiatanMitra() {
        const result = await this.prisma.kegiatan.findMany({
            include: {
                mitra: true,
            }
        });
        return result;
    }
    async getKegiatanMitraById(id) {
        const result = await this.prisma.mitra.findUnique({
            where: { id },
            include: {
                KegiatanMitra: true
            }
        });
        return result;
    }
    async countKegiatanMitra(year) {
        const dataMitra = await this.prisma.mitra.findMany({
            include: {
                _count: {
                    select: {
                        KegiatanMitra: {
                            where: {
                                tahun: year
                            }
                        },
                    },
                },
            }
        });
        const sortedData = dataMitra.sort((a, b) => {
            return b._count.KegiatanMitra - a._count.KegiatanMitra;
        });
        const formattedData = sortedData.map(mitra => ({
            id: mitra.id,
            namaLengkap: mitra.namaLengkap,
            jumlahKegiatan: mitra._count.KegiatanMitra,
        }));
        return formattedData;
    }
    async createKegiatanMitra(dto) {
        const dataMitra = await this.prisma.mitra.findUnique({
            where: {
                sobatId: dto.id_sobat
            }
        });
        if (!dataMitra) {
            throw new common_1.NotFoundException(`Mitra dengan ID ${dto.id_sobat} tidak ditemukan.`);
        }
        const dataKegiatan = await this.prisma.kegiatan.findFirst({
            where: {
                kodeKegiatan: dto.kegiatanId
            }
        });
        if (!dataKegiatan) {
            throw new common_1.NotFoundException(`Mitra dengan ID ${dto.kegiatanId} tidak ditemukan.`);
        }
        const result = this.prisma.kegiatanMitra.create({
            data: {
                bulan: dataKegiatan.bulan,
                tanggal: dataKegiatan.tanggal,
                tim: dataKegiatan.tim,
                nama_survei: dataKegiatan.nama_survei,
                nama_survei_sobat: dataKegiatan.nama_survei_sobat,
                kegiatan: dataKegiatan.kegiatan,
                pcl_pml_olah: dto.pcl_pml_olah,
                nama_petugas: dataMitra.namaLengkap,
                id_sobat: dto.id_sobat,
                satuan: dto.satuan,
                volum: dto.volum,
                harga_per_satuan: dto.harga_per_satuan,
                jumlah: dto.jumlah,
                konfirmasi: dto.konfirmasi,
                flag_sobat: dto.flag_sobat,
                tahun: dataKegiatan.tahun,
                kegiatanId: dto.kegiatanId
            },
        });
        const honorPayload = {
            ...dto,
            bulan: dataKegiatan.bulan,
            tahun: dataKegiatan.tahun,
        };
        await this.updateHonorPerBulan(honorPayload);
        return result;
    }
    async deleteKegiatanMitra(id) {
        const kegiatanMitra = await this.prisma.kegiatanMitra.findUnique({
            where: { id },
            select: {
                id_sobat: true,
                bulan: true,
                tahun: true,
            },
        });
        if (!kegiatanMitra) {
            throw new common_1.NotFoundException(`Kegiatan mitra dengan ID ${id} tidak ditemukan.`);
        }
        await this.prisma.kegiatanMitra.delete({
            where: { id },
        });
        await this.updateHonorBulanTertentu(kegiatanMitra.id_sobat, kegiatanMitra.bulan, kegiatanMitra.tahun);
        return { status: 'success', message: 'Kegiatan mitra berhasil dihapus.' };
    }
    async updateHonorBulanTertentu(id_sobat, bulan, tahun) {
        const bulanKey = bulan.toLowerCase();
        const totalHonorResult = await this.prisma.kegiatanMitra.aggregate({
            _sum: {
                jumlah: true,
            },
            where: {
                id_sobat: id_sobat,
                bulan: bulan,
                tahun: tahun,
            },
        });
        const totalHonor = totalHonorResult._sum.jumlah || 0;
        const updateData = {};
        updateData[bulanKey] = totalHonor;
        await this.prisma.honor.upsert({
            where: {
                sobatId_tahun: {
                    sobatId: id_sobat,
                    tahun: tahun,
                },
            },
            create: {
                sobatId: id_sobat,
                tahun: tahun,
                [bulanKey]: totalHonor,
            },
            update: updateData,
        });
    }
    async updateHonorPerBulan(data) {
        if (Array.isArray(data) === true) {
            const honorPerBulan = data.reduce((acc, current) => {
                const sobatId = current.id_sobat;
                const bulan = String(current.bulan).toLowerCase();
                const key = `${sobatId}-${bulan}`;
                if (!acc[key]) {
                    acc[key] = {
                        sobatId: sobatId,
                        bulan: bulan,
                        total_jumlah: new binary_1.Decimal(0),
                        tahun: current.tahun,
                    };
                }
                acc[key].total_jumlah = acc[key].total_jumlah.plus(current.jumlah);
                return acc;
            }, {});
            const honorToUpdate = Object.values(honorPerBulan);
            await this.prisma.$transaction(honorToUpdate.map((honor) => {
                const bulanKey = honor.bulan;
                const updateData = {};
                updateData[bulanKey] = {
                    increment: honor.total_jumlah,
                };
                return this.prisma.honor.upsert({
                    where: {
                        sobatId_tahun: {
                            sobatId: honor.sobatId,
                            tahun: honor.tahun,
                        }
                    },
                    create: {
                        sobatId: honor.sobatId,
                        tahun: honor.tahun,
                        [bulanKey]: honor.total_jumlah,
                    },
                    update: updateData,
                });
            }));
        }
        else {
            const sobatId = data.id_sobat;
            const bulan = String(data.bulan).toLowerCase();
            const bulanKey = bulan;
            const updateData = {};
            updateData[bulanKey] = {
                increment: data.jumlah,
            };
            await this.prisma.honor.upsert({
                where: {
                    sobatId_tahun: {
                        sobatId: sobatId,
                        tahun: data.tahun,
                    },
                },
                create: {
                    sobatId: sobatId,
                    tahun: data.tahun,
                    [bulanKey]: data.jumlah,
                },
                update: updateData,
            });
        }
    }
    async generateUniqHash(data) {
        const key = `${data.bulan}|${data.tanggal}|${data.tim || ''}|${data.nama_survei}|${data.nama_survei_sobat || ''}|${data.kegiatan || ''}|${data.tahun}`;
        return crypto.createHash('md5').update(key).digest('hex');
    }
    async uploadExcelFile(file) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const dataToProcess = XLSX.utils.sheet_to_json(worksheet);
        if (dataToProcess.length === 0) {
            return {
                statusCode: 500,
                message: 'Data kosong. Tambahkan baris.',
            };
        }
        const dataWithMissingId = dataToProcess.filter(row => !row['ID SOBAT']);
        if (dataWithMissingId.length > 0) {
            throw new common_1.BadRequestException('Terdapat data dengan ID Sobat yang kosong. Mohon periksa kembali file Anda.');
        }
        const uniqueSobatIds = [...new Set(dataToProcess.map(row => String(row['ID SOBAT'])))];
        const existingMitras = await this.prisma.mitra.findMany({
            where: {
                sobatId: { in: uniqueSobatIds },
            },
            select: { sobatId: true },
        });
        const existingSobatIdSet = new Set(existingMitras.map(m => m.sobatId));
        const nonExistingSobatIds = uniqueSobatIds.filter(id => !existingSobatIdSet.has(id));
        if (nonExistingSobatIds.length > 0) {
            throw new common_1.BadRequestException(`ID Sobat berikut tidak ditemukan di database: ${nonExistingSobatIds.join(', ')}`);
        }
        return dataToProcess;
    }
    async processExcelFile(dataToProcess) {
        const kegiatanData = await Promise.all(dataToProcess.map(async (row) => {
            const base = {
                bulan: String(row['BULAN LAPANGAN'] || ''),
                tanggal: String(row['TANGGAL LAPANGAN'] || ''),
                tim: String(row['TIM'] || ''),
                nama_survei: String(row['NAMA SURVEI'] || ''),
                nama_survei_sobat: String(row['NAMA SURVEI SOBAT'] || ''),
                kegiatan: String(row['KEGIATAN'] || ''),
                tahun: 2025,
            };
            return {
                ...base,
                kodeKegiatan: await this.generateUniqHash(base),
            };
        }));
        await this.prisma.kegiatan.createMany({
            data: kegiatanData,
            skipDuplicates: true
        });
        const createdKegiatan = await this.prisma.kegiatan.findMany({
            select: {
                kodeKegiatan: true,
                bulan: true,
                tanggal: true,
                tim: true,
                nama_survei: true,
                nama_survei_sobat: true,
                kegiatan: true,
            },
        });
        const kegiatanMap = new Map();
        createdKegiatan.forEach(keg => {
            const key = `${keg.bulan}-${keg.tanggal}-${keg.tim}-${keg.nama_survei}-${keg.nama_survei_sobat}-${keg.kegiatan}`;
            kegiatanMap.set(key, keg.kodeKegiatan);
        });
        const validData = dataToProcess.map((row) => {
            const key = `${String(row['BULAN LAPANGAN'] || '')}-${String(row['TANGGAL LAPANGAN'] || '')}-${String(row['TIM'] || '')}-${String(row['NAMA SURVEI'] || '')}-${String(row['NAMA SURVEI SOBAT'] || '')}-${String(row['KEGIATAN'] || '')}`;
            const kegiatanId = kegiatanMap.get(key) || null;
            return {
                bulan: String(row['BULAN LAPANGAN'] || ''),
                tanggal: String(row['TANGGAL LAPANGAN'] || ''),
                tim: String(row['TIM'] || ''),
                nama_survei: String(row['NAMA SURVEI'] || ''),
                nama_survei_sobat: String(row['NAMA SURVEI SOBAT'] || ''),
                kegiatan: String(row['KEGIATAN'] || ''),
                pcl_pml_olah: String(row['PCL/PML/OLAH'] || ''),
                nama_petugas: String(row['NAMA PETUGAS'] || ''),
                id_sobat: String(row['ID SOBAT'] || ''),
                satuan: String(row['SATUAN'] || ''),
                volum: parseInt(row['VOLUME'] || 0),
                harga_per_satuan: parseFloat(row['HARGA PER SATUAN'] || 0),
                jumlah: parseFloat(row['JUMLAH'] || 0),
                konfirmasi: String(row['KETERANGAN/STATUS KONFIRMASI'] || ''),
                flag_sobat: String(row['FLAG SOBAT'] || ''),
                tahun: 2025,
                kegiatanId: kegiatanId
            };
        });
        const result = await this.prisma.kegiatanMitra.createMany({
            data: validData,
            skipDuplicates: true
        });
        await this.updateHonorPerBulan(validData);
        return {
            statusCode: 200,
            message: `${result.count} data berhasil diunggah dan disimpan.`,
            data: result,
        };
    }
};
exports.KegiatanmitraService = KegiatanmitraService;
exports.KegiatanmitraService = KegiatanmitraService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], KegiatanmitraService);
//# sourceMappingURL=kegiatanmitra.service.js.map