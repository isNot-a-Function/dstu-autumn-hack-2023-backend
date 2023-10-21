-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "answer" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Direction" ADD COLUMN     "testId" INTEGER;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "logo" SET DEFAULT 'https://www.svgrepo.com/show/404636/avatar-people-person-profile-user.svg';

-- AddForeignKey
ALTER TABLE "Direction" ADD CONSTRAINT "Direction_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE SET NULL ON UPDATE CASCADE;
