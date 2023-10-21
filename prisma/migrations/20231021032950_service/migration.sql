/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('singleResponse', 'multipleResponse', 'detailedResponse', 'codeResponse');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fullname" TEXT,
ADD COLUMN     "logo" TEXT DEFAULT 'https://image.pngaaa.com/560/2546560-middle.png',
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "tgLink" TEXT,
ADD COLUMN     "vkLink" TEXT,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Specialization" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,

    CONSTRAINT "Specialization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Direction" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "specializationId" INTEGER NOT NULL,

    CONSTRAINT "Direction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT,
    "userId" INTEGER NOT NULL,
    "directionId" INTEGER NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Test" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "testId" INTEGER NOT NULL,
    "type" "TaskType" NOT NULL,
    "question" TEXT NOT NULL,
    "correctSingleAnswer" INTEGER,
    "correctMultipleAnswer" INTEGER[],

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answer" TEXT,
    "userId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessagerGroup" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatorId" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "title" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT 'https://vectips.com/wp-content/uploads/2020/08/tutorial-preview-large-1.png',

    CONSTRAINT "MessagerGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "files" TEXT[],
    "senderId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ResponseToTest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AnswerToResponse" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MessagerGroupToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ResponseToTest_AB_unique" ON "_ResponseToTest"("A", "B");

-- CreateIndex
CREATE INDEX "_ResponseToTest_B_index" ON "_ResponseToTest"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AnswerToResponse_AB_unique" ON "_AnswerToResponse"("A", "B");

-- CreateIndex
CREATE INDEX "_AnswerToResponse_B_index" ON "_AnswerToResponse"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MessagerGroupToUser_AB_unique" ON "_MessagerGroupToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MessagerGroupToUser_B_index" ON "_MessagerGroupToUser"("B");

-- AddForeignKey
ALTER TABLE "Direction" ADD CONSTRAINT "Direction_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "Specialization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_directionId_fkey" FOREIGN KEY ("directionId") REFERENCES "Direction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "MessagerGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResponseToTest" ADD CONSTRAINT "_ResponseToTest_A_fkey" FOREIGN KEY ("A") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ResponseToTest" ADD CONSTRAINT "_ResponseToTest_B_fkey" FOREIGN KEY ("B") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerToResponse" ADD CONSTRAINT "_AnswerToResponse_A_fkey" FOREIGN KEY ("A") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnswerToResponse" ADD CONSTRAINT "_AnswerToResponse_B_fkey" FOREIGN KEY ("B") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessagerGroupToUser" ADD CONSTRAINT "_MessagerGroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "MessagerGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessagerGroupToUser" ADD CONSTRAINT "_MessagerGroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
