"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HonormitraModule = void 0;
const common_1 = require("@nestjs/common");
const honormitra_service_1 = require("./honormitra.service");
const core_1 = require("@nestjs/core");
const auth_guard_1 = require("../auth/auth.guard");
const honormitra_controller_1 = require("./honormitra.controller");
let HonormitraModule = class HonormitraModule {
};
exports.HonormitraModule = HonormitraModule;
exports.HonormitraModule = HonormitraModule = __decorate([
    (0, common_1.Module)({
        providers: [
            honormitra_service_1.HonormitraService,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
        ],
        controllers: [honormitra_controller_1.HonormitraController],
        imports: [HonormitraModule],
    })
], HonormitraModule);
//# sourceMappingURL=honormitra.module.js.map