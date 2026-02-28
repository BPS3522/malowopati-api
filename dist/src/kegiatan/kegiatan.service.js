"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KegiatanService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const kegiatanmitra_service_1 = require("../kegiatanmitra/kegiatanmitra.service");
const filters_service_1 = require("../filters/filters.service");
const client_1 = require("@prisma/client");
let KegiatanService = class KegiatanService {
    prisma;
    kegiatanmitraService;
    filtersService;
    constructor(prisma, kegiatanmitraService, filtersService) {
        this.prisma = prisma;
        this.kegiatanmitraService = kegiatanmitraService;
        this.filtersService = filtersService;
    }
    async createKegiatan(dto) {
        const result = {
            bulan: dto.bulan,
            tanggal: dto.tanggal,
            tim: dto.tim,
            nama_survei: dto.nama_survei,
            nama_survei_sobat: dto.nama_survei_sobat,
            kegiatan: dto.kegiatan,
            tahun: dto.tahun,
            bulan_angka: dto.bulan_angka,
            judul: dto.judul || client_1.TypeKegiatan.PENDATAAN_LAPANGAN,
            jenis_kegiatan: dto.jenis_kegiatan || client_1.TypeKegiatan.PENDATAAN_LAPANGAN,
            hari: dto.hari,
            tanggal_mulai: dto.tanggal_mulai,
            hari_selesai: dto.hari_selesai,
            tanggal_selesai: dto.tanggal_selesai,
        };
        const kodeKeg = await this.kegiatanmitraService.generateUniqHash(result);
        const dataToSave = {
            ...result,
            id: dto.id,
            kodeKegiatan: kodeKeg,
        };
        const createdKegiatan = await this.prisma.kegiatan.create({
            data: dataToSave,
        });
        let tahunRecord = await this.filtersService.findTahun(Number(dto.tahun));
        if (!tahunRecord) {
            tahunRecord = await this.filtersService.createTahun(Number(dto.tahun));
        }
        return createdKegiatan;
    }
    async getKegiatanById(id) {
        return this.prisma.kegiatan.findUnique({
            where: { id },
            include: {
                mitra: true,
            },
        });
    }
    async deleteKegiatan(id) {
        const kegiatan = await this.getKegiatanById(id);
        let kodeKegiatan = '';
        let year = 0;
        if (!kegiatan) {
            throw new common_1.NotFoundException(`Kegiatan dengan ID ${id} tidak ditemukan.`);
        }
        else {
            kodeKegiatan = kegiatan.kodeKegiatan;
            year = kegiatan.tahun;
        }
        await this.filtersService.deleteTahun(year);
        try {
            await this.prisma.kegiatanMitra.deleteMany({
                where: {
                    kegiatanId: kodeKegiatan,
                },
            });
            kegiatan.mitra.forEach((element) => {
                this.kegiatanmitraService.updateHonorBulanTertentu(element.id_sobat, element.bulan, element.tahun);
            });
            return this.prisma.kegiatan.delete({
                where: { id },
            });
        }
        catch (error) {
            console.error('Detail Error Malowopati:', error);
            throw new common_1.BadRequestException({
                statusCode: 500,
                message: 'Gagal menyimpan data. Silakan cek konsol atau hubungi admin.',
                error: error.message,
            });
        }
    }
    async getRekapKegiatan(tahun) {
        const kegiatan = await this.prisma.kegiatan.findMany({
            where: {
                tahun: tahun,
            },
            select: {
                bulan: true,
                nama_survei: true,
            },
            orderBy: {
                id: 'asc',
            },
        });
        const rekapKegiatan = kegiatan.reduce((acc, current) => {
            const bulan = current.bulan || 'Tidak Diketahui';
            if (!acc[bulan]) {
                acc[bulan] = [];
            }
            if (current.nama_survei) {
                acc[bulan].push(current.nama_survei);
            }
            return acc;
        }, {});
        const result = Object.keys(rekapKegiatan).map((bulan) => ({
            bulan: bulan,
            kegiatan: rekapKegiatan[bulan],
        }));
        return result;
    }
    async getKegiatanByTim(filters) {
        const { year, month, idSobat } = filters;
        const kegiatan = await this.prisma.kegiatanMitra.groupBy({
            by: ['tim', 'nama_survei'],
            where: {
                ...(idSobat ? { id_sobat: idSobat } : {}),
                ...(year ? { tahun: Number(year) } : {}),
                ...(month ? { bulan: month } : {}),
            },
            _count: { _all: true },
        });
        const groupedObj = kegiatan.reduce((acc, item) => {
            if (!acc[item.tim]) {
                acc[item.tim] = {
                    id: item.tim,
                    label: item.tim,
                    value: 0,
                };
            }
            acc[item.tim].value += 1;
            return acc;
        }, {});
        const grouped = Object.values(groupedObj);
        const countKegiatan = await this.prisma.kegiatan.count({
            where: {
                ...(year ? { tahun: Number(year) } : {}),
                ...(month ? { bulan: month } : {}),
            },
        });
        return {
            grouped,
            total: countKegiatan,
        };
    }
};
exports.KegiatanService = KegiatanService;
exports.KegiatanService = KegiatanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        kegiatanmitra_service_1.KegiatanmitraService,
        filters_service_1.FiltersService])
], KegiatanService);
//# sourceMappingURL=kegiatan.service.js.map