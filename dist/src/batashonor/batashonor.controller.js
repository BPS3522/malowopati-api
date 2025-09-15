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
exports.BatashonorController = void 0;
const common_1 = require("@nestjs/common");
const batashonor_service_1 = require("./batashonor.service");
let BatashonorController = class BatashonorController {
    batasHonorService;
    constructor(batasHonorService) {
        this.batasHonorService = batasHonorService;
    }
    async getBatasHonor() {
        const batasHonor = await this.batasHonorService.getBatasHonorService();
        return {
            status_code: 200,
            message: 'Succes get all movies',
            data: batasHonor,
        };
    }
};
exports.BatashonorController = BatashonorController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BatashonorController.prototype, "getBatasHonor", null);
exports.BatashonorController = BatashonorController = __decorate([
    (0, common_1.Controller)('batashonor'),
    __metadata("design:paramtypes", [batashonor_service_1.BatashonorService])
], BatashonorController);
//# sourceMappingURL=batashonor.controller.js.map