-- CreateTable
CREATE TABLE "TopUpBalance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sum" DOUBLE PRECISION NOT NULL,
    "toUserId" TEXT,

    CONSTRAINT "TopUpBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DecreaseBalance" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sum" DOUBLE PRECISION NOT NULL,
    "fromUserId" TEXT,

    CONSTRAINT "DecreaseBalance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TopUpBalance" ADD CONSTRAINT "TopUpBalance_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecreaseBalance" ADD CONSTRAINT "DecreaseBalance_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
