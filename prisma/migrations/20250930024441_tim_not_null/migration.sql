/*
  Warnings:

  - Made the column `tim` on table `KegiatanMitra` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."KegiatanMitra" ALTER COLUMN "tim" SET NOT NULL;
