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
exports.HonormitraController = void 0;
const common_1 = require("@nestjs/common");
const honormitra_service_1 = require("./honormitra.service");
let HonormitraController = class HonormitraController {
    honorMitraService;
    constructor(honorMitraService) {
        this.honorMitraService = honorMitraService;
    }
    async getHonorMitra(year) {
        const honorMitra = await this.honorMitraService.getHonorMitra({ year });
        return {
            status_code: 200,
            message: 'Succes get all honor mitra',
            data: honorMitra,
        };
    }
    async getRekapHonorPerBulan(year) {
        const selectedYear = parseInt(year);
        const rekapHonorPerBulan = await this.honorMitraService.getRekapHonorPerBulan(selectedYear);
        return {
            status_code: 200,
            message: 'Succes get rekap honor per bulan',
            data: rekapHonorPerBulan,
        };
    }
    async getHonorMitraWithKegiatan(year, month) {
        const honorMitraWithKegiatan = await this.honorMitraService.getHonorMitraWithKegiatan({
            year,
            month,
        });
        return {
            status_code: 200,
            message: 'Succes get rekap honor per bulan',
            data: honorMitraWithKegiatan,
        };
    }
};
exports.HonormitraController = HonormitraController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HonormitraController.prototype, "getHonorMitra", null);
__decorate([
    (0, common_1.Get)('rekap/:year'),
    __param(0, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HonormitraController.prototype, "getRekapHonorPerBulan", null);
__decorate([
    (0, common_1.Get)('kegiatan'),
    __param(0, (0, common_1.Query)('year')),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HonormitraController.prototype, "getHonorMitraWithKegiatan", null);
exports.HonormitraController = HonormitraController = __decorate([
    (0, common_1.Controller)('honormitra'),
    __metadata("design:paramtypes", [honormitra_service_1.HonormitraService])
], HonormitraController);
//# sourceMappingURL=honormitra.controller.js.map