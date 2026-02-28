"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const jwt_1 = require("@nestjs/jwt");
const constants_1 = require("./constants");
const bcrypt = __importStar(require("bcrypt-ts"));
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    prismaService;
    constructor(usersService, jwtService, prismaService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prismaService = prismaService;
    }
    async signIn(username, pass, res) {
        if (!username || !pass) {
            throw new common_1.UnauthorizedException('Username dan Password wajib diisi');
        }
        const user = await this.usersService.findOne(username);
        if (!user) {
            throw new common_1.NotFoundException('User tidak ditemukan');
        }
        const roles = await this.prismaService.usersRoles.findMany({
            where: {
                userId: user.id,
            },
            select: {
                role: true,
            },
        });
        const isPasswordValid = await bcrypt.compare(pass, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Password salah');
        }
        const payload = {
            sub: user.id,
            username: user.username,
            roles: roles.map((r) => r.role.name),
        };
        const accessToken = await this.jwtService.signAsync(payload, {
            secret: constants_1.jwtConstants.secret,
            expiresIn: '60s',
        });
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: constants_1.refreshJwtConstants.secret,
            expiresIn: '1d',
        });
        const hashedRefresh = await bcrypt.hash(refreshToken, 10);
        await this.prismaService.tokens.create({
            data: {
                token: hashedRefresh,
                device: 'Chrome Windows',
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
                userId: user.id,
            },
        });
        const cookie = res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000,
        });
        return {
            access_token: accessToken,
            user: {
                id: user.id,
                username: user.username,
                roles: payload.roles,
            },
        };
    }
    async refresh(req, res) {
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            throw new common_1.ForbiddenException('Refresh token tidak ditemukan');
        }
        const refreshToken = cookies.jwt;
        try {
            const decoded = this.jwtService.verify(refreshToken, { secret: constants_1.refreshJwtConstants.secret });
            const tokens = await this.prismaService.tokens.findMany({
                where: { userId: decoded.sub },
            });
            let isValid = false;
            for (const t of tokens) {
                if (await bcrypt.compare(refreshToken, t.token)) {
                    isValid = true;
                    break;
                }
            }
            if (!isValid) {
                throw new common_1.ForbiddenException('Refresh token tidak valid atau telah dicabut.');
            }
            const newAccessToken = this.jwtService.sign({ sub: decoded.sub, username: decoded.username, roles: decoded.roles }, { secret: constants_1.jwtConstants.secret, expiresIn: '60s' });
            return { access_token: newAccessToken };
        }
        catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new common_1.ForbiddenException('Refresh token kedaluwarsa. Silakan login ulang.');
            }
            throw new common_1.ForbiddenException('Terjadi kesalahan saat memproses refresh token.');
        }
    }
    async logout(req, res) {
        const cookies = req.cookies;
        if (!cookies?.jwt)
            res.sendStatus(204);
        const id = req.user.id;
        const refreshToken = cookies.jwt;
        const tokens = await this.prismaService.tokens.findMany({
            where: { id },
        });
        for (const t of tokens) {
            if (await bcrypt.compare(refreshToken, t.token)) {
                await this.prismaService.tokens.delete({ where: { id: t.id } });
                break;
            }
        }
        res.clearCookie('jwt', { httpOnly: true });
        return (res.statusMessage = 'Berhasil logout');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map