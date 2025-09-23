import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants, refreshJwtConstants } from './constants';
import { Response } from 'express';
import * as bcrypt from 'bcrypt-ts';
import { User } from 'src/users/dto/user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prismaService: PrismaService
  ) {}

  // private usersDb = {
  //   users: [] as (User & { refreshToken?: string })[],
  //   setUsers: function (data: (User & { refreshToken?: string })[]) {
  //     this.users = data;
  //   },
  // };

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
   secure : true, // Ganti ini
    // secure: process.env.NODE_ENV === 'production', // Atau pakai ini untuk produksi
   sameSite: "none", // Atau 'None' jika diperlukan dengan secure: true
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
});
    return {
      access_token: accessToken,
    };
  }

async refresh(req: any, res: Response) {
    console.log('--- Menerima permintaan refresh token ---');
    console.log('Request Origin:', req.headers.origin); // Periksa asal permintaan
    console.log('Cookies yang diterima:', req.cookies); // Periksa isi cookie yang masuk

    const cookies = req.cookies;
    if (!cookies?.jwt) {
      console.log('Gagal: Cookie "jwt" tidak ditemukan.');
      throw new ForbiddenException('Refresh token tidak ditemukan');
    }

    const refreshToken = cookies.jwt;

    try {
      // Pastikan token bisa diverifikasi sebelum mencari di DB
      const decoded = this.jwtService.verify(refreshToken, { secret: refreshJwtConstants.secret });
      console.log('Token berhasil diverifikasi. Username:', decoded.username, 'ID:', decoded.sub);
      
      const tokens = await this.prismaService.tokens.findMany({
        where: { userId: decoded.sub }
      });

      console.log(`Ditemukan ${tokens.length} token di DB untuk user ini.`);

      let isValid = false;
      for (const t of tokens) {
        if (await bcrypt.compare(refreshToken, t.token)) {
          isValid = true;
          console.log('Berhasil: Refresh token cocok dengan yang di database.');
          break;
        }
      }

      if (!isValid) {
        console.log('Gagal: Token dari cookie tidak cocok dengan token yang di DB.');
        throw new ForbiddenException('Refresh token tidak valid atau telah dicabut.');
      }

      // Buat dan kirimkan access token baru
      const newAccessToken = this.jwtService.sign(
        { sub: decoded.sub, username: decoded.username },
        { secret: refreshJwtConstants.secret, expiresIn: '30s' },
      );

      console.log('Berhasil: Access token baru dibuat dan dikirim.');
      return { access_token: newAccessToken };

    } catch (err) {
      console.log('Terjadi kesalahan:', err.message);
      // Ganti pesan error agar lebih informatif
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
