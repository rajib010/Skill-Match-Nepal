/*
  Warnings:

  - Added the required column `updatedAt` to the `SearchQuery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `job_requirement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `user_skill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."SearchQuery" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."job_requirement" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."user_skill" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);
