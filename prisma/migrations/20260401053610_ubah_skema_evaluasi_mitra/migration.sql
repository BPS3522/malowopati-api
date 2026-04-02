/*
  Warnings:

  - The primary key for the `EvaluasiMitra` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `mitraId` on the `EvaluasiMitra` table. All the data in the column will be lost.
  - The `id` column on the `EvaluasiMitra` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[sobatId,bulan,tahun,tim]` on the table `EvaluasiMitra` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sobatId` to the `EvaluasiMitra` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tahun` on the `EvaluasiMitra` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "EvaluasiMitra" DROP CONSTRAINT "EvaluasiMitra_mitraId_fkey";

-- DropIndex
DROP INDEX "EvaluasiMitra_mitraId_bulan_tahun_tim_key";

-- AlterTable
ALTER TABLE "EvaluasiMitra" DROP CONSTRAINT "EvaluasiMitra_pkey",
DROP COLUMN "mitraId",
ADD COLUMN     "sobatId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
DROP COLUMN "tahun",
ADD COLUMN     "tahun" INTEGER NOT NULL,
ADD CONSTRAINT "EvaluasiMitra_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluasiMitra_sobatId_bulan_tahun_tim_key" ON "EvaluasiMitra"("sobatId", "bulan", "tahun", "tim");

-- AddForeignKey
ALTER TABLE "EvaluasiMitra" ADD CONSTRAINT "EvaluasiMitra_sobatId_fkey" FOREIGN KEY ("sobatId") REFERENCES "Mitra"("sobatId") ON DELETE CASCADE ON UPDATE CASCADE;
