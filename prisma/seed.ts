import { PrismaClient } from '@prisma/client'
import fs from 'fs';
import csv from 'csv-parser';
import { resolve } from 'path';
import { rejects } from 'assert';
import { User } from 'src/users/dto/user.dto';
import * as bcrypt from 'bcrypt-ts';

const prisma = new PrismaClient();

async function main() {
  const mitraResults: any[] = [];
  const kegiatanResults: any[] = [];
  const batasHonorResults: any[] = [];

  // Seed Mitra
  const mitraPromise = new Promise<void>((resolve, reject) => {
    fs.createReadStream('prisma/mitra.csv')
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => {
        mitraResults.push({
          namaLengkap: data['Nama Lengkap'],
          posisi: data['Posisi'],
          statusSeleksi: data['Status Seleksi (1=Terpilih, 2=Tidak Terpilih)'],
          posisiDaftar: data['Posisi Daftar'],
          alamatDetail: data['Alamat Detail'],
          alamatProv: parseInt(data['Alamat Prov']) || 0,
          alamatKab: parseInt(data['Alamat Kab']) || 0,
          alamatKec: parseInt(data['Alamat Kec']) || 0,
          alamatDesa: parseInt(data['Alamat Desa']) || 0,
          tempatTanggalLahir: data['Tempat, Tanggal Lahir (Umur)*'],
          jenisKelamin: data['Jenis Kelamin'],
          pendidikan: data['Pendidikan'],
          pekerjaan: data['Pekerjaan'],
          deskripsiPekerjaan: data['Deskripsi Pekerjaan Lain'] || null,
          noTelp: data['No Telp'],
          sobatId: data['SOBAT ID'],
          email: data['Email'],
        });
      })
      .on('end', async () => {
        if (mitraResults.length > 0) {
          await prisma.mitra.createMany({ 
            data: mitraResults,   
            skipDuplicates: true 
          });
          console.log('✅ Seed Mitra selesai.');
        }
        resolve();
      })
      .on('error', reject);
  });

  async function usersSeed(){
    const usersSeed=[
      {
        username : 'bpsbojonegoro',
        password: await bcrypt.hash("statistik3522", 10)
      },
      {
        username : 'bendahara',
        password: await bcrypt.hash("statistik3522", 10)
      },
      {
        username : 'umum',
        password: await bcrypt.hash("statistik3522", 10)
      },
      {
        username : 'ppk',
        password: await bcrypt.hash("statistik3522", 10)
      },
      {
        username : 'ppspm',
        password: await bcrypt.hash("statistik3522", 10)
      }
    ]
      try {
        await prisma.users.deleteMany()
    const result = await prisma.users.createMany({
      data: usersSeed,
    });
      console.log(`Seeding complete. ${result.count} users created.`);
    } catch (e) {
      console.error('Seeding failed:', e);
    } finally {
      console.log('✅ Seed Users selesai.');
      await prisma.$disconnect();
    }
  }

  //   async function roleSeed(){
  //   const rolesSeed=[
  //     {
  //       name : 'Bendahara',
  //       kode: 2001
  //     },
  //     {
  //       name : 'PPK',
  //       kode: 2002
  //     },
  //     {
  //       name : 'PPSPM',
  //       kode: 2003
  //     },
  //     {
  //       name : 'Umum',
  //       kode: 2004
  //     },
  //   ]
  //     try {
  //       await prisma.users.deleteMany()
  //   const result = await prisma.roles.createMany({
  //     data: rolesSeed,
  //   });
  //     console.log(`Seeding complete. ${result.count} roles created.`);
  //   } catch (e) {
  //     console.error('Seeding failed:', e);
  //   } finally {
  //     console.log('✅ Seed Roles selesai.');
  //     await prisma.$disconnect();
  //   }
  // }

  
// async function usersRolesSeed() {
//   const users = await prisma.users.findMany();
//   const roles = await prisma.roles.findMany();

//   const relations = [
//     { username: 'bendahara', roleName: 'Bendahara' },
//     { username: 'ppk', roleName: 'PPK' },
//     { username: 'ppspm', roleName: 'PPSPM' },
//     { username: 'umum', roleName: 'Umum' },
//     { username: 'bpsbojonegoro', roleName: 'Umum' },
//   ];

//   const usersRolesSeed = relations.map((rel) => {
//     const user = users.find((u) => u.username === rel.username);
//     const role = roles.find((r) => r.name === rel.roleName);
//     if (!user || !role) throw new Error(`Data tidak ditemukan untuk ${rel.username} atau ${rel.roleName}`);
//     return {
//       userId: user.id,
//       rolesId: role.id,
//     };
//   });

//   await prisma.usersRoles.deleteMany();
//   const result = await prisma.usersRoles.createMany({ data: usersRolesSeed });
//   console.log(`✅ ${result.count} user-role relations created.`);
// }

  //Seed Batas Honor Mitra
  // const batasHonor = new Promise<void>((resolve, reject) => {
  //   fs.createReadStream('prisma/batashonor.csv')
  //     .pipe(csv({ separator: ';' }))
  //     .on('data', (data) => {
  //       batasHonorResults.push({
  //         nama_posisi: data['nama posisi'],
  //         biaya: parseInt(data['biaya']),
  //         keterangan: data['keterangan'],
  //         flag: parseInt(data['flag']),
  //       });
  //     })
  //     .on('end', async () => {
  //       if (batasHonorResults.length > 0) {
  //         await prisma.batasHonor.deleteMany({});
  //         await prisma.batasHonor.createMany({ data: batasHonorResults });
  //         console.log('✅ Seed Batas Honor selesai.');
  //       }
  //       resolve();
  //     })
  //     .on('error', reject);
  // });

    // Seed Kegiatan Mitra
  // const kegiatanPromise = new Promise<void>((resolve, reject) => {
  //   fs.createReadStream('prisma/kegiatan-mitra.csv')
  //     .pipe(csv({ separator: ';' }))
  //     .on('data', (data) => {
  //       if (data['BULAN LAPANGAN']) {
  //       kegiatanResults.push({
  //         bulan: data['BULAN LAPANGAN'],
  //         tanggal: data['TANGGAL LAPANGAN'],
  //         tim: data['TIM'],
  //         nama_survei: data['NAMA SURVEI'],
  //         nama_survei_sobat: data['NAMA SURVEI SOBAT'],
  //         kegiatan: data['KEGIATAN'],
  //         pcl_pml_olah: data['PCL/PML/OLAH'],
  //         nama_petugas :data['NAMA PETUGAS'],
  //         id_sobat: data['ID SOBAT'],
  //         satuan: data['SATUAN'],
  //         volum: parseInt(data['VOLUME']),
  //         harga_per_satuan: data['HARGA PER SATUAN']
  //           ? parseInt(data['HARGA PER SATUAN'].replace(/,/g, ''))
  //           : null,
  //         jumlah: data['JUMLAH']
  //           ? parseInt(data['JUMLAH'].replace(/,/g, ''))
  //           : null,
  //         konfirmasi: data['KETERANGAN/STATUS KONFIRMASI'],
  //         flag_sobat: data['FLAG SOBAT'],
  //         tahun: 2025
  //       });
  //     }})
  //     .on('end', async () => {
  //       if (kegiatanResults.length > 0) {
  //         await prisma.kegiatanMitra.deleteMany({});
  //         await prisma.kegiatanMitra.createMany({ data: kegiatanResults });
  //         console.log('✅ Seed Kegiatan Mitra selesai.');
  //       }
  //       resolve();
  //     })
  //     .on('error', reject);
  // });
  
  usersSeed()
  //roleSeed()
  //usersRolesSeed()
  await Promise.all([mitraPromise]);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });