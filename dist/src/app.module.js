"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const mitra_module_1 = require("./mitra/mitra.module");
const kegiatanmitra_module_1 = require("./kegiatanmitra/kegiatanmitra.module");
const batashonor_module_1 = require("./batashonor/batashonor.module");
const files_module_1 = require("./files/files.module");
const honormitra_service_1 = require("./honormitra/honormitra.service");
const honormitra_controller_1 = require("./honormitra/honormitra.controller");
const honormitra_module_1 = require("./honormitra/honormitra.module");
const kegiatan_module_1 = require("./kegiatan/kegiatan.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const keuangan_module_1 = require("./keuangan/keuangan.module");
const filters_module_1 = require("./filters/filters.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            mitra_module_1.MitraModule,
            kegiatanmitra_module_1.KegiatanmitraModule,
            batashonor_module_1.BatashonorModule,
            files_module_1.FilesModule,
            honormitra_module_1.HonormitraModule,
            kegiatan_module_1.KegiatanModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            keuangan_module_1.KeuanganModule,
            filters_module_1.FiltersModule,
        ],
        controllers: [app_controller_1.AppController, honormitra_controller_1.HonormitraController],
        providers: [app_service_1.AppService, honormitra_service_1.HonormitraService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map