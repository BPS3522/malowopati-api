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
exports.KegiatanDto = void 0;
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const class_transformer_1 = require("class-transformer");
const daftarBulan = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];
class KegiatanDto {
    id;
    bulan;
    get bulan_angka() {
        return daftarBulan.indexOf(this.bulan) + 1;
    }
    tanggal;
    tim;
    nama_survei;
    nama_survei_sobat;
    kegiatan;
    tahun;
    kodeKegiatan;
    judul;
    jenis_kegiatan;
    hari;
    tanggal_mulai;
    hari_selesai;
    tanggal_selesai;
}
exports.KegiatanDto = KegiatanDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], KegiatanDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], KegiatanDto.prototype, "bulan", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], KegiatanDto.prototype, "tanggal", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], KegiatanDto.prototype, "tim", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanDto.prototype, "nama_survei", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanDto.prototype, "nama_survei_sobat", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanDto.prototype, "kegiatan", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], KegiatanDto.prototype, "tahun", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], KegiatanDto.prototype, "kodeKegiatan", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TypeKegiatan),
    __metadata("design:type", String)
], KegiatanDto.prototype, "judul", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(client_1.TypeKegiatan),
    __metadata("design:type", String)
], KegiatanDto.prototype, "jenis_kegiatan", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanDto.prototype, "hari", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], KegiatanDto.prototype, "tanggal_mulai", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], KegiatanDto.prototype, "hari_selesai", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], KegiatanDto.prototype, "tanggal_selesai", void 0);
//# sourceMappingURL=kegiatan.dto.js.map