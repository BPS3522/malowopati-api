-- CreateEnum
CREATE TYPE "TypeKegiatan" AS ENUM ('PENDATAAN_LAPANGAN', 'PENGAWASAN_LAPANGAN', 'PENGOLAHAN_LAPANGAN');

-- AlterTable
ALTER TABLE "Kegiatan" ADD COLUMN     "bulan_angka" INTEGER,
ADD COLUMN     "hari" TEXT,
ADD COLUMN     "hari_selesai" TEXT,
ADD COLUMN     "jenis_kegiatan" "TypeKegiatan" DEFAULT 'PENDATAAN_LAPANGAN',
ADD COLUMN     "judul" "TypeKegiatan" DEFAULT 'PENDATAAN_LAPANGAN',
ADD COLUMN     "tanggal_mulai" TIMESTAMP(3),
ADD COLUMN     "tanggal_selesai" TIMESTAMP(3),
ALTER COLUMN "tanggal" DROP NOT NULL;

-- AlterTable
ALTER TABLE "KegiatanMitra" ADD COLUMN     "kecamatan" TEXT,
ADD COLUMN     "no_kontrak_bast" TEXT,
ADD COLUMN     "no_kontrak_spk" TEXT,
ADD COLUMN     "no_urut_mitra" INTEGER,
ALTER COLUMN "tanggal" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Mitra" ADD COLUMN     "tahun" INTEGER[] DEFAULT ARRAY[]::INTEGER[];
