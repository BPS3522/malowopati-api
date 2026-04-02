/*
  Warnings:

  - The primary key for the `EvaluasiMitra` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "EvaluasiMitra" DROP CONSTRAINT "EvaluasiMitra_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "EvaluasiMitra_pkey" PRIMARY KEY ("id");
