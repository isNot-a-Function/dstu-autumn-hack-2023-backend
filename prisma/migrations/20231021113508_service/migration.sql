-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_testId_fkey";

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "testId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE SET NULL ON UPDATE CASCADE;
