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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KegiatanmitraController = void 0;
const common_1 = require("@nestjs/common");
const kegiatanmitra_service_1 = require("./kegiatanmitra.service");
const create_kegiatan_mitra_dto_1 = require("./dto/create-kegiatan-mitra.dto");
const platform_express_1 = require("@nestjs/platform-express");
const download_kegiatan_mitra_dto_1 = require("./dto/download-kegiatan-mitra.dto");
const delete_kegiatan_mitra_dto_1 = require("./dto/delete-kegiatan-mitra.dto");
let KegiatanmitraController = class KegiatanmitraController {
    KegiatanmitraService;
    constructor(KegiatanmitraService) {
        this.KegiatanmitraService = KegiatanmitraService;
    }
    async getKegiatanMitra(year, month, tim) {
        const kegiatanmitra = await this.KegiatanmitraService.getKegiatanMitra({ year, month, tim });
        return {
            status_code: 200,
            message: 'Succes get all kegiatan mitra',
            data: kegiatanmitra,
        };
    }
    async createKegiatanMitra(createKegiatanMitra) {
        const response = await this.KegiatanmitraService.createKegiatanMitra(createKegiatanMitra);
        return {
            status_code: 200,
            message: 'Kegiatan Mitra berhasil dibuat',
            data: response,
        };
    }
    async editKegiatanMitra(editKegiatanMitra) {
        try {
            const response = await this.KegiatanmitraService.editKegiatanMitra(editKegiatanMitra);
            return {
                status_code: 200,
                message: 'Kegiatan Mitra berhasil diupdate',
                data: response,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Edit Gagal');
        }
    }
    async uploadTemplate(file) {
        if (!file) {
            throw new common_1.BadRequestException('File tidak ditemukan.');
        }
        const result = await this.KegiatanmitraService.uploadExcelFile(file);
        return {
            status_code: 200,
            message: 'File berhasil diupload',
            data: result,
        };
    }
    async saveValidatedData(data) {
        const result = await this.KegiatanmitraService.processExcelFile(data);
        return {
            status_code: 200,
            message: 'File berhasil dikirim',
            data: result,
        };
    }
    async countKegiatanMitra(tahun) {
        const year = Number(tahun);
        const result = await this.KegiatanmitraService.countKegiatanMitra(year);
        return {
            status_code: 200,
            message: 'Get jumlah kegiatan mitra success',
            data: result,
        };
    }
    async countMitraKegiatanHonor(year, month, idSobat) {
        const tahun = Number(year);
        const result = await this.KegiatanmitraService.countMitraKegiatanHonor({
            year,
            month,
            idSobat,
        });
        return {
            status_code: 200,
            message: 'Get jumlah kegiatan mitra success',
            data: result,
        };
    }
    async downloadKegiatanMitra(query) {
        const result = this.KegiatanmitraService.downloadKegiatanMitra(query);
        return result;
    }
    async getKegiatanMitraById(idSobat, year, month) {
        const bulan = month;
        const tahun = Number(year);
        const id = Number(idSobat);
        return this.KegiatanmitraService.getKegiatanMitraById({ id, tahun, bulan });
    }
    async deleteKegiatanMitra(kegiatanMitraDto) {
        const { id } = kegiatanMitraDto;
        try {
            const result = await this.KegiatanmitraService.deleteKegiatanMitra(id);
            return {
                message: 'Delete succesfully',
                data: result,
            };
        }
        catch (error) {
            throw error;
        }
    }
};
exports.KegiatanmitraController = KegiatanmitraController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('tim')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], KegiatanmitraController.prototype, "getKegiatanMitra", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_kegiatan_mitra_dto_1.KegiatanMitraDto]),
    __metadata("design:returntype", Promise)
], KegiatanmitraController.prototype, "createKegiatanMitra", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KegiatanmitraController.prototype, "editKegiatanMitra", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KegiatanmitraController.prototype, "uploadTemplate", null);
__decorate([
    (0, common_1.Post)('save'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], KegiatanmitraController.prototype, "saveValidatedData", null);
__decorate([
    (0, common_1.Get)('count/:tahun'),
    __param(0, (0, common_1.Param)('tahun')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KegiatanmitraController.prototype, "countKegiatanMitra", null);
__decorate([
    (0, common_1.Get)('count/'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('idSobat')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], KegiatanmitraController.prototype, "countMitraKegiatanHonor", null);
__decorate([
    (0, common_1.Get)('download'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({
        transform: true,
    })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [download_kegiatan_mitra_dto_1.DownloadKegiatanMitraQueryDto]),
    __metadata("design:returntype", Promise)
], KegiatanmitraController.prototype, "downloadKegiatanMitra", null);
__decorate([
    (0, common_1.Get)(':idSobat'),
    __param(0, (0, common_1.Param)('idSobat', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String, String]),
    __metadata("design:returntype", Promise)
], KegiatanmitraController.prototype, "getKegiatanMitraById", null);
__decorate([
    (0, common_1.Delete)('delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [delete_kegiatan_mitra_dto_1.DeleteKegiatanMitra]),
    __metadata("design:returntype", Promise)
], KegiatanmitraController.prototype, "deleteKegiatanMitra", null);
exports.KegiatanmitraController = KegiatanmitraController = __decorate([
    (0, common_1.Controller)('kegiatanmitra'),
    __metadata("design:paramtypes", [kegiatanmitra_service_1.KegiatanmitraService])
], KegiatanmitraController);
//# sourceMappingURL=kegiatanmitra.controller.js.map