-- CreateTable
CREATE TABLE "public"."UsersRoles" (
    "userId" INTEGER NOT NULL,
    "rolesId" INTEGER NOT NULL,

    CONSTRAINT "UsersRoles_pkey" PRIMARY KEY ("userId","rolesId")
);

-- CreateTable
CREATE TABLE "public"."Roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "kode" INTEGER NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UsersRoles" ADD CONSTRAINT "UsersRoles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UsersRoles" ADD CONSTRAINT "UsersRoles_rolesId_fkey" FOREIGN KEY ("rolesId") REFERENCES "public"."Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
