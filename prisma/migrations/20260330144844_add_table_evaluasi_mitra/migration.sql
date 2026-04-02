-- CreateTable
CREATE TABLE "EvaluasiMitra" (
    "id" SERIAL NOT NULL,
    "mitraId" INTEGER NOT NULL,
    "bulan" TEXT NOT NULL,
    "tahun" TEXT NOT NULL,
    "tim" TEXT NOT NULL,
    "nilai" INTEGER NOT NULL,

    CONSTRAINT "EvaluasiMitra_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EvaluasiMitra_mitraId_bulan_tahun_tim_key" ON "EvaluasiMitra"("mitraId", "bulan", "tahun", "tim");

-- AddForeignKey
ALTER TABLE "EvaluasiMitra" ADD CONSTRAINT "EvaluasiMitra_mitraId_fkey" FOREIGN KEY ("mitraId") REFERENCES "Mitra"("id") ON DELETE CASCADE ON UPDATE CASCADE;
