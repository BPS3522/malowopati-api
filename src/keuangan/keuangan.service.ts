import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { KeuanganDto } from './dto/keuangan.dto';
import { UpdateKeuangaByPPSPMDto } from './dto/update-keuangan-ppspm.dto';
import { UpdateKeuangaByBendaharaDto } from './dto/update-keuangan-bendahara.dto';
import { UpdateKeuangaByUmumDto } from './dto/update-keuangan-umum.dto';
import { UpdateKeuangaByPPKDto } from './dto/update-keuangan-ppk.dto';

@Injectable()
export class KeuanganService {
  constructor(private prisma: PrismaService) {}

  async getAllKeuangan() {
    const result = await this.prisma.keuangan.findMany();
    return result;
  }

  async createKegiatan(dto: KeuanganDto) {
    const result = this.prisma.keuangan.create({
      data: {
        tim: dto.tim,
        bulan_kegiatan: dto.bulan_kegiatan,
        group_pok: dto.group_pok,
        detail: dto.detail,
        nomor_permintaan: dto.nomor_permintaan,
        deskripsi: dto.deskripsi,
        nomor_surat: dto.nomor_surat,
        tipe_form: dto.tipe_form,
        dibuat_oleh: dto.dibuat_oleh,
        jumlah_usulan: dto.jumlah_usulan,
        link_scan: dto.link_scan,
        bulan_pembayaran: dto.bulan_pembayaran,
        teknis_kirim_ke_umum: dto.teknis_kirim_ke_umum || '',
      },
    });
    return result;
  }

  async updateByPPK(id: number, updateKeuangaByPPKDto: UpdateKeuangaByPPKDto) {
    try {
      const result = await this.prisma.keuangan.update({
        where: {
          id: id,
        },
        data: updateKeuangaByPPKDto,
      });

      return {
        status: 'success',
        message: 'Keuangan berhasil diupdate',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Error updating class: ${error.message}`,
      };
    }
  }

  async updateByPPSPM(id: number, updateKeuangaByPPSPMDto: UpdateKeuangaByPPSPMDto) {
    try {
      const result = await this.prisma.keuangan.update({
        where: {
          id: id,
        },
        data: updateKeuangaByPPSPMDto,
      });

      return {
        status: 'success',
        message: 'Keuangan berhasil diupdate',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Error updating class: ${error.message}`,
      };
    }
  }

  async updateByBendahara(id: number, updateKeuangaByBendaharaDto: UpdateKeuangaByBendaharaDto) {
    try {
      const result = await this.prisma.keuangan.update({
        where: {
          id: id,
        },
        data: updateKeuangaByBendaharaDto,
      });

      return {
        status: 'success',
        message: 'Keuangan berhasil diupdate',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Error updating class: ${error.message}`,
      };
    }
  }

  async updateByUmum(id: number, updateKeuangaByUmumDto: UpdateKeuangaByUmumDto) {
    try {
      const result = await this.prisma.keuangan.update({
        where: {
          id: id,
        },
        data: updateKeuangaByUmumDto,
      });

      return {
        status: 'success',
        message: 'Keuangan berhasil diupdate',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Error updating class: ${error.message}`,
      };
    }
  }
}
