"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KegiatanmitraModule = void 0;
const common_1 = require("@nestjs/common");
const kegiatanmitra_service_1 = require("./kegiatanmitra.service");
const kegiatanmitra_controller_1 = require("./kegiatanmitra.controller");
const core_1 = require("@nestjs/core");
const auth_guard_1 = require("../auth/auth.guard");
const filters_module_1 = require("../filters/filters.module");
let KegiatanmitraModule = class KegiatanmitraModule {
};
exports.KegiatanmitraModule = KegiatanmitraModule;
exports.KegiatanmitraModule = KegiatanmitraModule = __decorate([
    (0, common_1.Module)({
        providers: [
            kegiatanmitra_service_1.KegiatanmitraService,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
        ],
        controllers: [kegiatanmitra_controller_1.KegiatanmitraController],
        exports: [kegiatanmitra_service_1.KegiatanmitraService],
        imports: [filters_module_1.FiltersModule],
    })
], KegiatanmitraModule);
//# sourceMappingURL=kegiatanmitra.module.js.map