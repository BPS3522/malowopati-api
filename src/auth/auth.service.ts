import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants, refreshJwtConstants } from './constants';
import { Response } from 'express';
import * as bcrypt from 'bcrypt-ts';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService
  ) {}

  async signIn(username: string, pass: string, res: Response): Promise<any> {
    if (!username || !pass) {
      throw new UnauthorizedException('Username dan Password wajib diisi');
    }

    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const isPasswordValid = await bcrypt.compare(pass, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password salah');
    }

    const payload = { sub: user.id, username: user.username };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.secret,
      expiresIn: '20s',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: refreshJwtConstants.secret,
      expiresIn: '1d',
    });
    
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);

    await this.prismaService.tokens.create({ // Simpan refresh token di DB
      data:{
        token: hashedRefresh,
        device: 'Chrome Windows',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        userId: user.id
      }
    })

    const cookie = res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure : true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
    });
    
    return {
      access_token: accessToken,
    };
  }

async refresh(req: any, res: Response) {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      throw new ForbiddenException('Refresh token tidak ditemukan');
    }

    const refreshToken = cookies.jwt;

    try {
      const decoded = this.jwtService.verify(refreshToken, { secret: refreshJwtConstants.secret });
      
      const tokens = await this.prismaService.tokens.findMany({
        where: { userId: decoded.sub }
      });

      let isValid = false;
      for (const t of tokens) {
        if (await bcrypt.compare(refreshToken, t.token)) {
          isValid = true;
          break;
        }
      }

      if (!isValid) {
        throw new ForbiddenException('Refresh token tidak valid atau telah dicabut.');
      }

      const newAccessToken = this.jwtService.sign(
        { sub: decoded.sub, username: decoded.username },
        { secret: jwtConstants.secret, expiresIn: '30s' },
      );

      return { access_token: newAccessToken };

    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new ForbiddenException('Refresh token kedaluwarsa. Silakan login ulang.');
      }
      throw new ForbiddenException('Terjadi kesalahan saat memproses refresh token.');
    }
  }

  async logout(req: any, res: Response){
    const cookies = req.cookies;
    if (!cookies?.jwt) res.sendStatus(204);
    const id = req.user.id

    const refreshToken = cookies.jwt;

    const tokens = await this.prismaService.tokens.findMany({
      where: { id },
    });

    for (const t of tokens) { // Delete refresh token in DB
      if (await bcrypt.compare(refreshToken, t.token)) {
        await this.prismaService.tokens.delete({ where: { id: t.id } });
        break;
      }
    }

    res.clearCookie('jwt', {httpOnly: true});

    return res.statusMessage= "Berhasil logout";
  }
}
