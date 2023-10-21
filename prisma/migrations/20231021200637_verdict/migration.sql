/*
  Warnings:

  - Made the column `answer` on table `Answer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `text` on table `Response` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "answer" SET NOT NULL;

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "verdict" TEXT,
ALTER COLUMN "text" SET NOT NULL;
