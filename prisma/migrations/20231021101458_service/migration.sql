-- CreateEnum
CREATE TYPE "DirectionType" AS ENUM ('internship', 'practice');

-- AlterTable
ALTER TABLE "Direction" ADD COLUMN     "type" "DirectionType";
