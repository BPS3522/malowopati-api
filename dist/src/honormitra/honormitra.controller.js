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
    async getHonorMitra() {
        const honorMitra = await this.honorMitraService.getHonorMitra();
        return {
            status_code: 200,
            message: 'Succes get all movies',
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
};
exports.HonormitraController = HonormitraController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HonormitraController.prototype, "getHonorMitra", null);
__decorate([
    (0, common_1.Get)('rekap/:year'),
    __param(0, (0, common_1.Param)('year')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HonormitraController.prototype, "getRekapHonorPerBulan", null);
exports.HonormitraController = HonormitraController = __decorate([
    (0, common_1.Controller)('honormitra'),
    __metadata("design:paramtypes", [honormitra_service_1.HonormitraService])
], HonormitraController);
//# sourceMappingURL=honormitra.controller.js.map