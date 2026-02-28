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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const prisma_service_1 = require("../prisma/prisma.service");
let FilesService = class FilesService {
    prisma;
    uploadPath = './uploads';
    constructor(prisma) {
        this.prisma = prisma;
    }
    async saveFileMetadata(file, description) {
        return this.prisma.files.create({
            data: {
                filename: file.filename,
                originalName: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
                path: file.path,
                uploadDate: new Date(),
                description: description,
            },
        });
    }
    async getFilePath(filename) {
        const filePath = (0, path_1.join)(process.cwd(), this.uploadPath, filename);
        if (!(0, fs_1.existsSync)(filePath)) {
            throw new common_1.HttpException('File not found', common_1.HttpStatus.NOT_FOUND);
        }
        return filePath;
    }
    async getFileInfo(filename) {
        const filePath = await this.getFilePath(filename);
        const stats = (0, fs_1.statSync)(filePath);
        return {
            filename: filename,
            originalName: filename,
            mimetype: 'application/octet-stream',
            size: stats.size,
            path: filePath,
            uploadDate: stats.birthtime,
        };
    }
    async getAllFiles() {
        let fileInfos = [];
        const info = await this.prisma.files.findMany();
        fileInfos = info;
        return fileInfos;
    }
    async streamFile(filename, res) {
        const filePath = await this.getFilePath(filename);
        const file = (0, fs_1.createReadStream)(filePath);
        file.pipe(res);
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FilesService);
//# sourceMappingURL=files.service.js.map