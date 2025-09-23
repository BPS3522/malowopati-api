-- CreateTable
CREATE TABLE "public"."Tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "device" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Tokens" ADD CONSTRAINT "Tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
