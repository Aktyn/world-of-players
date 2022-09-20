-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('regular', 'moderator', 'admin');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(42) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "salt" VARCHAR(16) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "created" BIGINT NOT NULL,
    "lastLogin" BIGINT NOT NULL DEFAULT 0,
    "confirmed" VARCHAR(64),
    "role" "UserRole" NOT NULL DEFAULT 'regular',
    "avatar" BYTEA,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "accessToken" VARCHAR(64) NOT NULL,
    "expiresTimestamp" BIGINT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("accessToken")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User" USING HASH ("name");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User" USING HASH ("role");

-- CreateIndex
CREATE INDEX "User_created_idx" ON "User"("created");

-- CreateIndex
CREATE INDEX "Session_accessToken_idx" ON "Session" USING HASH ("accessToken");

-- CreateIndex
CREATE INDEX "Session_expiresTimestamp_idx" ON "Session"("expiresTimestamp");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
