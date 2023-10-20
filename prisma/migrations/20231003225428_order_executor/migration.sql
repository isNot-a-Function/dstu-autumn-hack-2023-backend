/*
  Warnings:

  - A unique constraint covering the columns `[orderId,executorId]` on the table `Response` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "doneExecutorId" TEXT,
ADD COLUMN     "executorId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Response_orderId_executorId_key" ON "Response"("orderId", "executorId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_executorId_fkey" FOREIGN KEY ("executorId") REFERENCES "ExecutorInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_doneExecutorId_fkey" FOREIGN KEY ("doneExecutorId") REFERENCES "ExecutorInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
