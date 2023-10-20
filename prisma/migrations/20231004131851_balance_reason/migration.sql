/*
  Warnings:

  - Added the required column `reason` to the `DecreaseBalance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `TopUpBalance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DecreaseBalance" ADD COLUMN     "reason" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TopUpBalance" ADD COLUMN     "reason" TEXT NOT NULL;
