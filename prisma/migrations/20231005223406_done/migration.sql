-- AlterEnum
ALTER TYPE "OrderStatusEnum" ADD VALUE 'inCheck';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "comment" TEXT;
