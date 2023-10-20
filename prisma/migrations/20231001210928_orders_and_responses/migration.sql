/*
  Warnings:

  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CostTypeEnum" AS ENUM ('none', 'contract', 'inHour', 'inOrder');

-- CreateEnum
CREATE TYPE "ExpirienceEnum" AS ENUM ('lessYear', 'overYear', 'overThreeYear', 'overFiveYear', 'overTeenYear');

-- CreateEnum
CREATE TYPE "OrderStatusEnum" AS ENUM ('active', 'archived');

-- AlterTable
ALTER TABLE "CustomerInfo" ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "ExecutorInfo" ADD COLUMN     "classification" TEXT,
ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "costType" "CostTypeEnum" NOT NULL DEFAULT 'none',
ADD COLUMN     "description" TEXT,
ADD COLUMN     "expirience" "ExpirienceEnum" NOT NULL DEFAULT 'lessYear',
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "tags" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "cost" DOUBLE PRECISION,
ADD COLUMN     "costType" "CostTypeEnum" NOT NULL DEFAULT 'none',
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "responsesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "OrderStatusEnum" NOT NULL DEFAULT 'active',
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "city" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "family" TEXT;

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderId" TEXT NOT NULL,
    "executorId" TEXT NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "site" TEXT,
    "phone" TEXT,
    "mail" TEXT,
    "telegram" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ExecutorInfoToSpecialization" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Contact_userId_key" ON "Contact"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_ExecutorInfoToSpecialization_AB_unique" ON "_ExecutorInfoToSpecialization"("A", "B");

-- CreateIndex
CREATE INDEX "_ExecutorInfoToSpecialization_B_index" ON "_ExecutorInfoToSpecialization"("B");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_executorId_fkey" FOREIGN KEY ("executorId") REFERENCES "ExecutorInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExecutorInfoToSpecialization" ADD CONSTRAINT "_ExecutorInfoToSpecialization_A_fkey" FOREIGN KEY ("A") REFERENCES "ExecutorInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ExecutorInfoToSpecialization" ADD CONSTRAINT "_ExecutorInfoToSpecialization_B_fkey" FOREIGN KEY ("B") REFERENCES "Specialization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
