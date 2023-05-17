/*
  Warnings:

  - You are about to drop the `Message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_RoomsToUser` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Rooms` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "FieldStatusEnum" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "RoomTypeEnum" AS ENUM ('CLIENT', 'TECHNICIAN');

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_userId_fkey";

-- DropForeignKey
ALTER TABLE "_RoomsToUser" DROP CONSTRAINT "_RoomsToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_RoomsToUser" DROP CONSTRAINT "_RoomsToUser_B_fkey";

-- AlterTable
ALTER TABLE "Rooms" ADD COLUMN     "branchId" UUID,
ADD COLUMN     "createdById" UUID,
ADD COLUMN     "metaData" JSONB DEFAULT '{}',
ADD COLUMN     "status" "FieldStatusEnum" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "type" "RoomTypeEnum" NOT NULL DEFAULT 'CLIENT',
ADD COLUMN     "updatedAt" TIMESTAMP(3),
ADD COLUMN     "updatedById" UUID,
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(6);

-- DropTable
DROP TABLE "Message";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "_RoomsToUser";

-- CreateTable
CREATE TABLE "Users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255),
    "password" VARCHAR(255),
    "metaData" JSONB DEFAULT '{}',
    "status" "FieldStatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "createdById" UUID,
    "updatedById" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branches" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "location" JSONB DEFAULT '{}',
    "metaData" JSONB DEFAULT '{}',
    "status" "FieldStatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "createdById" UUID,
    "updatedById" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" UUID NOT NULL,
    "roomId" UUID NOT NULL,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_RoomsToUsers" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_phone_key" ON "Users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "_RoomsToUsers_AB_unique" ON "_RoomsToUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomsToUsers_B_index" ON "_RoomsToUsers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Rooms_name_key" ON "Rooms"("name");

-- AddForeignKey
ALTER TABLE "Rooms" ADD CONSTRAINT "Rooms_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomsToUsers" ADD CONSTRAINT "_RoomsToUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RoomsToUsers" ADD CONSTRAINT "_RoomsToUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
