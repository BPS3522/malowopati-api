import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import csv from 'csv-parser';
import * as bcrypt from 'bcrypt-ts';
import * as XLSX from 'xlsx';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 MEMULAI PROSES SEEDING...');
  console.log('=================================');

  const mitraResults: any[] = [];
  const kegiatanResults: any[] = [];
  const batasHonorResults: any[] = [];

  try {
    // 🔴 STEP 0: HAPUS SEMUA DATA DULU (URUTAN TERBALIK)
    console.log('\n📦 [0/7] Membersihkan database...');
    await cleanDatabase();

    // 1. SEED USERS
    console.log('\n📦 [1/7] Seeding Users...');
    await usersSeed();

    // 2. SEED ROLES
    console.log('\n📦 [2/7] Seeding Roles...');
    await roleSeed();

    // 3. SEED USER ROLES (Relasi)
    console.log('\n📦 [3/7] Seeding User Roles...');
    await usersRolesSeed();

    // 4. SEED MITRA (dari CSV)
    console.log('\n📦 [4/7] Seeding Mitra from CSV...');
    await seedMitra(mitraResults);

    // 5. SEED BATAS HONOR (dari CSV)
    console.log('\n📦 [5/7] Seeding Batas Honor from CSV...');
    await seedBatasHonor(batasHonorResults);

    // 6. SEED KEGIATAN MITRA dari Excel
    console.log('\n📦 [6/7] Seeding Kegiatan Mitra from Excel...');
    //await seedKegiatanMitraExcel();

    // Tampilkan ringkasan
    await tampilkanRingkasan();
  } catch (error) {
    console.error('\n❌❌❌ ERROR SAAT SEEDING:', error);
  }
}

/**
 * FUNGSI BARU: Membersihkan database dengan urutan yang benar
 */
async function cleanDatabase() {
  try {
    // Hapus dalam urutan terbalik (dari child ke parent)
    console.log('  🧹 Menghapus UsersRoles...');
    await prisma.usersRoles.deleteMany({});

    console.log('  🧹 Menghapus KegiatanMitra...');
    await prisma.kegiatanMitra.deleteMany({});

    console.log('  🧹 Menghapus Mitra...');
    await prisma.mitra.deleteMany({});

    console.log('  🧹 Menghapus BatasHonor...');
    await prisma.batasHonor.deleteMany({});

    console.log('  🧹 Menghapus Users...');
    await prisma.users.deleteMany({});

    console.log('  🧹 Menghapus Roles...');
    await prisma.roles.deleteMany({});

    console.log('  ✅ Database bersih');
  } catch (error) {
    console.error('  ❌ Error saat membersihkan database:', error);
    throw error;
  }
}

async function usersSeed() {
  const usersSeed = [
    { username: 'bpsbojonegoro', password: await bcrypt.hash('statistik3522', 10) },
    { username: 'bendahara', password: await bcrypt.hash('statistik3522', 10) },
    { username: 'umum', password: await bcrypt.hash('statistik3522', 10) },
    { username: 'ppk', password: await bcrypt.hash('statistik3522', 10) },
    { username: 'ppspm', password: await bcrypt.hash('statistik3522', 10) },
  ];

  const result = await prisma.users.createMany({
    data: usersSeed,
    skipDuplicates: true,
  });
  console.log(`  ✅ ${result.count} users created`);
}

async function roleSeed() {
  const rolesSeed = [
    { name: 'Bendahara', kode: 2001 },
    { name: 'PPK', kode: 2002 },
    { name: 'PPSPM', kode: 2003 },
    { name: 'Umum', kode: 2004 },
  ];

  const result = await prisma.roles.createMany({
    data: rolesSeed,
    skipDuplicates: true,
  });
  console.log(`  ✅ ${result.count} roles created`);
}

async function usersRolesSeed() {
  const users = await prisma.users.findMany();
  const roles = await prisma.roles.findMany();

  console.log(`  📊 Found ${users.length} users and ${roles.length} roles`);

  const relations = [
    { username: 'bendahara', roleName: 'Bendahara' },
    { username: 'ppk', roleName: 'PPK' },
    { username: 'ppspm', roleName: 'PPSPM' },
    { username: 'umum', roleName: 'Umum' },
    { username: 'bpsbojonegoro', roleName: 'Umum' },
  ];

  const usersRolesSeed = relations.map((rel) => {
    const user = users.find((u) => u.username === rel.username);
    const role = roles.find((r) => r.name === rel.roleName);

    if (!user || !role) {
      throw new Error(`Data tidak ditemukan untuk ${rel.username} atau ${rel.roleName}`);
    }

    return {
      userId: user.id,
      rolesId: role.id,
    };
  });

  const result = await prisma.usersRoles.createMany({
    data: usersRolesSeed,
    skipDuplicates: true,
  });
  console.log(`  ✅ ${result.count} user-role relations created`);
}

async function seedMitra(mitraResults: any[]) {
  return new Promise<void>((resolve, reject) => {
    const filePath = 'prisma/mitra.csv';

    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️ File ${filePath} tidak ditemukan, melewati seed Mitra`);
      return resolve();
    }

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => {
        mitraResults.push({
          namaLengkap: data['Nama Lengkap'] || '',
          posisi: data['Posisi'] || '',
          statusSeleksi: data['Status Seleksi (1=Terpilih, 2=Tidak Terpilih)'] || '',
          posisiDaftar: data['Posisi Daftar'] || '',
          alamatDetail: data['Alamat Detail'] || '',
          alamatProv: parseInt(data['Alamat Prov']) || 0,
          alamatKab: parseInt(data['Alamat Kab']) || 0,
          alamatKec: parseInt(data['Alamat Kec']) || 0,
          alamatDesa: parseInt(data['Alamat Desa']) || 0,
          tempatTanggalLahir: data['Tempat, Tanggal Lahir (Umur)*'] || '',
          jenisKelamin: data['Jenis Kelamin'] || '',
          pendidikan: data['Pendidikan'] || '',
          pekerjaan: data['Pekerjaan'] || '',
          deskripsiPekerjaan: data['Deskripsi Pekerjaan Lain'] || null,
          noTelp: data['No Telp'] || '',
          sobatId: data['SOBAT ID'] || '',
          email: data['Email'] || '',
          tahun: data['Tahun'] ? [parseInt(data['Tahun'])] : [],
        });
      })
      .on('end', async () => {
        if (mitraResults.length > 0) {
          const result = await prisma.mitra.createMany({
            data: mitraResults,
            skipDuplicates: true,
          });
          console.log(`  ✅ ${result.count} mitra created from CSV`);
        } else {
          console.log('  ⚠️ Tidak ada data mitra dari CSV');
        }
        resolve();
      })
      .on('error', (err) => {
        console.error('  ❌ Error membaca CSV:', err);
        reject(err);
      });
  });
}

async function seedBatasHonor(batasHonorResults: any[]) {
  return new Promise<void>((resolve, reject) => {
    const filePath = 'prisma/batashonor.csv';

    if (!fs.existsSync(filePath)) {
      console.log(`  ⚠️ File ${filePath} tidak ditemukan, melewati seed Batas Honor`);
      return resolve();
    }

    fs.createReadStream(filePath)
      .pipe(csv({ separator: ';' }))
      .on('data', (data) => {
        batasHonorResults.push({
          nama_posisi: data['nama posisi'] || '',
          biaya: parseInt(data['biaya']) || 0,
          keterangan: data['keterangan'] || '',
          flag: parseInt(data['flag']) || 0,
        });
      })
      .on('end', async () => {
        if (batasHonorResults.length > 0) {
          const result = await prisma.batasHonor.createMany({
            data: batasHonorResults,
            skipDuplicates: true,
          });
          console.log(`  ✅ ${result.count} batas honor created from CSV`);
        } else {
          console.log('  ⚠️ Tidak ada data batas honor dari CSV');
        }
        resolve();
      })
      .on('error', (err) => {
        console.error('  ❌ Error membaca CSV:', err);
        reject(err);
      });
  });
}

/**
 * FUNGSI: Membaca file Excel kegiatan-mitra.xlsx
 */
// async function seedKegiatanMitraExcel() {
//   try {
//     const filePath = 'prisma/kegiatan-mitra.xlsx';

//     // Cek apakah file ada
//     if (!fs.existsSync(filePath)) {
//       console.log(`  ⚠️ File ${filePath} tidak ditemukan!`);
//       return;
//     }

//     // Baca file Excel
//     const workbook = XLSX.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];

//     // Konversi ke JSON
//     const excelData: any[] = XLSX.utils.sheet_to_json(worksheet);

//     console.log(`  📊 Ditemukan ${excelData.length} baris data di Excel`);

//     if (excelData.length === 0) {
//       console.log('  ⚠️ Tidak ada data di file Excel');
//       return;
//     }

//     // Tampilkan sample kolom
//     console.log('  📝 Kolom Excel:', Object.keys(excelData[0]));

//     // Mapping data
//     const kegiatanResults = excelData.map((row) => {
//       // Parse PCL/PML/NAMA PETUGAS jika kolomnya gabung
//       let pcl_pml = '';
//       let nama_petugas = '';

//       if (row['PCL/PML/NAMA PETUGAS']) {
//         const parts = String(row['PCL/PML/NAMA PETUGAS']).split(' ');
//         pcl_pml = parts[0] || '';
//         nama_petugas = parts.slice(1).join(' ') || '';
//       }

//       return {
//         bulan: row['BULAN LAPANGAN'] || '',
//         tanggal: row['TANGG AL LAPAN GAN'] || row['TANGGAL LAPANGAN'] || null,
//         tim: row['TIM'] || '',
//         nama_survei: row['NAMA SURVEI'] || '',
//         nama_survei_sobat: row['NAMA SURVEI SOBAT'] || '',
//         kegiatan: row['KEGIANAT'] || row['KEGIATAN'] || '',
//         pcl_pml_olah: pcl_pml || row['PCL/PML/OLAH'] || '',
//         nama_petugas: nama_petugas || row['NAMA PETUGAS'] || '',
//         id_sobat: String(row['ID SOBAT'] || '').replace(/[^0-9]/g, ''),
//         satuan: row['SATU/LUMEN'] || row['SATUAN'] || '',
//         volum: parseInt(row['VOLUME'] || '0') || 0,
//         harga_per_satuan: parseHarga(row['HARGA PER SATUAN']),
//         jumlah: parseHarga(row['JMLAH'] || row['JUMLAH']),
//         konfirmasi:
//           row['KETERANGKAN/STATUS UNIK BIMASI'] || row['KETERANGAN/STATUS KONFIRMASI'] || '',
//         flag_sobat: row['FLAG SOBAT'] || '',
//         tahun: 2025,
//       };
//     });

//     // Insert data baru
//     const result = await prisma.kegiatanMitra.createMany({
//       data: kegiatanResults,
//       skipDuplicates: true,
//     });

//     console.log(`  ✅ ${result.count} kegiatan mitra berhasil di-import dari Excel`);
//   } catch (error) {
//     console.error('  ❌ Error membaca Excel:', error);
//     throw error;
//   }
// }

function parseHarga(value: any): number {
  if (!value) return 0;
  try {
    if (typeof value === 'number') return value;
    const stringValue = String(value).replace(/,/g, '');
    const parsed = parseInt(stringValue);
    return isNaN(parsed) ? 0 : parsed;
  } catch {
    return 0;
  }
}

async function tampilkanRingkasan() {
  console.log('\n📊 RINGKASAN DATA:');
  console.log('==================');

  try {
    const users = await prisma.users.count();
    const roles = await prisma.roles.count();
    const usersRoles = await prisma.usersRoles.count();
    const mitra = await prisma.mitra.count();
    const batasHonor = await prisma.batasHonor.count();
    const kegiatanMitra = await prisma.kegiatanMitra.count();

    console.log(`  👤 Users           : ${users} data`);
    console.log(`  🎭 Roles           : ${roles} data`);
    console.log(`  🔗 UsersRoles      : ${usersRoles} data`);
    console.log(`  👥 Mitra           : ${mitra} data`);
    console.log(`  💰 Batas Honor     : ${batasHonor} data`);
    console.log(`  📝 Kegiatan Mitra  : ${kegiatanMitra} data`);
  } catch (error) {
    console.log('  ⚠️ Tidak bisa menampilkan ringkasan lengkap');
  }
}

// JALANKAN MAIN FUNCTION
main()
  .catch((e) => {
    console.error('\n❌ FATAL ERROR:', e);
  })
  .finally(async () => {
    console.log('\n🔌 Menutup koneksi database...');
    await prisma.$disconnect();
    console.log('✅ Selesai!');
  });
