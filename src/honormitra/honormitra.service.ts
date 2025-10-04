import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { contains } from 'class-validator';
import { Prisma } from '@prisma/client';
import { totalmem } from 'os';

@Injectable()
export class HonormitraService {
    constructor(private prisma: PrismaService) {}
    
    private readonly rupiahFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  formatRupiah(value: number): string {
    return this.rupiahFormatter.format(value);
  }

    async getHonorMitra(search: string = '') {
    const where: Prisma.HonorWhereInput = search
        ? {
            mitra: {
                namaLengkap: {
                    contains: search,
                }
            }
        }
        : {};

        const honorMitra = await this.prisma.mitra.findMany({
        select: {
            id: true,
            namaLengkap: true,
            sobatId: true,
            honors: true
        }
        });

        const detailHonorData = honorMitra.map((item) => {
          const latestHonor = item.honors[item.honors.length - 1] || {};

          return {
            id: item.id,
            namaLengkap: item.namaLengkap,
            sobatId: item.sobatId,
            januari: latestHonor.januari || 0,
            februari: latestHonor.februari || 0,
            maret: latestHonor.maret || 0,
            april: latestHonor.april || 0,
            mei: latestHonor.mei || 0,
            juni: latestHonor.juni || 0,
            juli: latestHonor.juli || 0,
            agustus: latestHonor.agustus || 0,
            september: latestHonor.september || 0,
            oktober: latestHonor.oktober || 0,
            november: latestHonor.november || 0,
            desember: latestHonor.desember || 0,
          };
        });

        const detailHonorDataWithTotal = detailHonorData.map((item)=>(
        {
            ...item,
            total:item.januari + item.februari + item.maret + item.april + item.mei + item.juni + item.juli + item.agustus + item.september + item.oktober + item.november + item.desember
        }))

        const result = detailHonorDataWithTotal.sort((a,b)=> b.total-a.total)
    return result;
}

async getHonorMitraWithKegiatan(filters: any){
    const {year, month} = filters

    const dataMitra = await this.prisma.mitra.findMany({
      include: {
        _count: {
          select: {
            KegiatanMitra:{
              where:{
                ...( year ? { tahun: Number(year)} : {} ),
                ...( month ? { bulan: month} : {} )
              }
            },
          },
        },
        honors:{
            where:{
                ...(year ? {tahun: Number(year)} : {})
            }
        }
      }
    });

    const sortedData = dataMitra.sort((a, b) => {
      return b._count.KegiatanMitra - a._count.KegiatanMitra;
    });

    const formattedData = sortedData.map((item) => {
        const honorRecord = item.honors[item.honors.length - 1] || {};

        let honor = 0;
        if(month){
            honor = honorRecord[month.toLowerCase()] ?? 0;
        } else{
            honor =
                (honorRecord.januari ?? 0) +
                (honorRecord.februari ?? 0) +
                (honorRecord.maret ?? 0) +
                (honorRecord.april ?? 0) +
                (honorRecord.mei ?? 0) +
                (honorRecord.juni ?? 0) +
                (honorRecord.juli ?? 0) +
                (honorRecord.agustus ?? 0) +
                (honorRecord.september ?? 0) +
                (honorRecord.oktober ?? 0) +
                (honorRecord.november ?? 0) +
                (honorRecord.desember ?? 0);
        }

        
        return {
            id: item.id,
            sobatId : item.sobatId,
            namaLengkap: item.namaLengkap,
            jumlahKegiatan: item._count.KegiatanMitra,
            honor
        };
    })

    const top10 = formattedData
    .sort((a, b) => b.honor - a.honor)
    .slice(0, 10);

    return top10;
}

async getRekapHonorPerBulan(selectedYear: number){
    const rekapPerbulan = await this.prisma.honor.findMany({
        where: {
            tahun : selectedYear
        }
    })

    const totalPerBulan = {
        januari: 0,
        februari: 0,
        maret: 0,
        april: 0,
        mei: 0,
        juni: 0,
        juli: 0,
        agustus: 0,
        september: 0,
        oktober: 0,
        november: 0,
        desember: 0
    };

    rekapPerbulan.forEach((honor)=>{
        totalPerBulan.januari += honor.januari;
        totalPerBulan.februari += honor.februari;
        totalPerBulan.maret += honor.maret;
        totalPerBulan.april += honor.april;
        totalPerBulan.mei += honor.mei;
        totalPerBulan.juni += honor.juni;
        totalPerBulan.juli += honor.juli;
        totalPerBulan.agustus += honor.agustus;
        totalPerBulan.september += honor.september;
        totalPerBulan.oktober += honor.oktober;
        totalPerBulan.november += honor.november;
        totalPerBulan.desember += honor.desember;
    })
    const result = Object.entries(totalPerBulan).map(([bulan, total]) => ({
        bulan: bulan.charAt(0).toUpperCase() + bulan.slice(1),
        total: total
    }));

    return result;
}
}