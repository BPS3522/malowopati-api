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
exports.KegiatanController = void 0;
const common_1 = require("@nestjs/common");
const kegiatan_service_1 = require("./kegiatan.service");
const kegiatan_dto_1 = require("./dto/kegiatan.dto");
let KegiatanController = class KegiatanController {
    kegiatanService;
    constructor(kegiatanService) {
        this.kegiatanService = kegiatanService;
    }
    async createKegiatanMitra(kegiatanDto) {
        const response = await this.kegiatanService.createKegiatan(kegiatanDto);
        return {
            status_code: 200,
            message: 'Kegiatan berhasil dibuat',
            data: response,
        };
    }
    async getRekapKegiatan(tahun) {
        const year = Number(tahun);
        return this.kegiatanService.getRekapKegiatan(year);
    }
    async getRekapKegiatanByTim(year, month, idSobat) {
        const tahun = Number(year);
        return this.kegiatanService.getKegiatanByTim({ tahun, month, idSobat });
    }
    async deleteJawaban(id) {
        const kegiatanId = Number(id);
        await this.kegiatanService.deleteKegiatan(kegiatanId);
        return {
            status_code: 200,
            message: 'Kegiatan berhasil dihapus',
        };
    }
};
exports.KegiatanController = KegiatanController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [kegiatan_dto_1.KegiatanDto]),
    __metadata("design:returntype", Promise)
], KegiatanController.prototype, "createKegiatanMitra", null);
__decorate([
    (0, common_1.Get)(':tahun'),
    __param(0, (0, common_1.Param)('tahun')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KegiatanController.prototype, "getRekapKegiatan", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('idSobat')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], KegiatanController.prototype, "getRekapKegiatanByTim", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], KegiatanController.prototype, "deleteJawaban", null);
exports.KegiatanController = KegiatanController = __decorate([
    (0, common_1.Controller)('kegiatan'),
    __metadata("design:paramtypes", [kegiatan_service_1.KegiatanService])
], KegiatanController);
//# sourceMappingURL=kegiatan.controller.js.map