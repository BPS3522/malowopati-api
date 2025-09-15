"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KegiatanModule = void 0;
const common_1 = require("@nestjs/common");
const kegiatan_service_1 = require("./kegiatan.service");
const kegiatan_controller_1 = require("./kegiatan.controller");
const kegiatanmitra_module_1 = require("../kegiatanmitra/kegiatanmitra.module");
const core_1 = require("@nestjs/core");
const auth_guard_1 = require("../auth/auth.guard");
let KegiatanModule = class KegiatanModule {
};
exports.KegiatanModule = KegiatanModule;
exports.KegiatanModule = KegiatanModule = __decorate([
    (0, common_1.Module)({
        providers: [kegiatan_service_1.KegiatanService,
            {
                provide: core_1.APP_GUARD,
                useClass: auth_guard_1.AuthGuard,
            },
        ],
        controllers: [kegiatan_controller_1.KegiatanController],
        imports: [kegiatanmitra_module_1.KegiatanmitraModule],
    })
], KegiatanModule);
//# sourceMappingURL=kegiatan.module.js.map