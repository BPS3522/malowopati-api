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
exports.HonormitraService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HonormitraService = class HonormitraService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    rupiahFormatter = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    });
    formatRupiah(value) {
        return this.rupiahFormatter.format(value);
    }
    async getHonorMitra(search = '') {
        const where = search
            ? {
                mitra: {
                    namaLengkap: {
                        contains: search,
                    }
                }
            }
            : {};
        const honorMitra = await this.prisma.mitra.findMany({
            select: {
                id: true,
                namaLengkap: true,
                sobatId: true,
                honors: true
            }
        });
        const detailHonorData = honorMitra.map((item) => {
            const latestHonor = item.honors[item.honors.length - 1] || {};
            return {
                id: item.id,
                namaLengkap: item.namaLengkap,
                sobatId: item.sobatId,
                januari: latestHonor.januari || 0,
                februari: latestHonor.februari || 0,
                maret: latestHonor.maret || 0,
                april: latestHonor.april || 0,
                mei: latestHonor.mei || 0,
                juni: latestHonor.juni || 0,
                juli: latestHonor.juli || 0,
                agustus: latestHonor.agustus || 0,
                september: latestHonor.september || 0,
                oktober: latestHonor.oktober || 0,
                november: latestHonor.november || 0,
                desember: latestHonor.desember || 0,
            };
        });
        const detailHonorDataWithTotal = detailHonorData.map((item) => ({
            ...item,
            total: item.januari + item.februari + item.maret + item.april + item.mei + item.juni + item.juli + item.agustus + item.september + item.oktober + item.november + item.desember
        }));
        return detailHonorDataWithTotal;
    }
    async getRekapHonorPerBulan(selectedYear) {
        const rekapPerbulan = await this.prisma.honor.findMany({
            where: {
                tahun: selectedYear
            }
        });
        const totalPerBulan = {
            januari: 0,
            februari: 0,
            maret: 0,
            april: 0,
            mei: 0,
            juni: 0,
            juli: 0,
            agustus: 0,
            september: 0,
            oktober: 0,
            november: 0,
            desember: 0
        };
        rekapPerbulan.forEach((honor) => {
            totalPerBulan.januari += honor.januari;
            totalPerBulan.februari += honor.februari;
            totalPerBulan.maret += honor.maret;
            totalPerBulan.april += honor.april;
            totalPerBulan.mei += honor.mei;
            totalPerBulan.juni += honor.juni;
            totalPerBulan.juli += honor.juli;
            totalPerBulan.agustus += honor.agustus;
            totalPerBulan.september += honor.september;
            totalPerBulan.oktober += honor.oktober;
            totalPerBulan.november += honor.november;
            totalPerBulan.desember += honor.desember;
        });
        const result = Object.entries(totalPerBulan).map(([bulan, total]) => ({
            bulan: bulan.charAt(0).toUpperCase() + bulan.slice(1),
            total: total
        }));
        return result;
    }
};
exports.HonormitraService = HonormitraService;
exports.HonormitraService = HonormitraService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HonormitraService);
//# sourceMappingURL=honormitra.service.js.map