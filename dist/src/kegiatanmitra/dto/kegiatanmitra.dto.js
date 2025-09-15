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
exports.KegiatanMitraDto = void 0;
const class_validator_1 = require("class-validator");
class KegiatanMitraDto {
    id;
    bulan;
    tanggal;
    tim;
    nama_survei;
    nama_survei_sobat;
    kegiatan;
    pcl_pml_olah;
    nama_petugas;
    id_sobat;
    satuan;
    volum;
    harga_per_satuan;
    jumlah;
    konfirmasi;
    flag_sobat;
    tahun;
    kegiatanId;
}
exports.KegiatanMitraDto = KegiatanMitraDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], KegiatanMitraDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], KegiatanMitraDto.prototype, "bulan", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], KegiatanMitraDto.prototype, "tanggal", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], KegiatanMitraDto.prototype, "tim", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanMitraDto.prototype, "nama_survei", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanMitraDto.prototype, "nama_survei_sobat", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanMitraDto.prototype, "kegiatan", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanMitraDto.prototype, "pcl_pml_olah", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanMitraDto.prototype, "nama_petugas", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanMitraDto.prototype, "id_sobat", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanMitraDto.prototype, "satuan", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanMitraDto.prototype, "konfirmasi", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanMitraDto.prototype, "flag_sobat", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanMitraDto.prototype, "kegiatanId", void 0);
//# sourceMappingURL=kegiatanmitra.dto.js.map