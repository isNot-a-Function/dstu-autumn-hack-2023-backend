/*
  Warnings:

  - You are about to drop the column `userId` on the `Answer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Answer" DROP CONSTRAINT "Answer_userId_fkey";

-- AlterTable
ALTER TABLE "Answer" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "TaskAnswer" (
    "id" SERIAL NOT NULL,
    "answer" TEXT NOT NULL,
    "verdict" INTEGER,
    "answerModelId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "TaskAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskAnswer" ADD CONSTRAINT "TaskAnswer_answerModelId_fkey" FOREIGN KEY ("answerModelId") REFERENCES "Answer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAnswer" ADD CONSTRAINT "TaskAnswer_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskAnswer" ADD CONSTRAINT "TaskAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
