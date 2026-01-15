/*
  Warnings:

  - You are about to drop the column `postedById` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `coverLetter` on the `job_application` table. All the data in the column will be lost.
  - You are about to drop the column `cvParsedAt` on the `user_profile` table. All the data in the column will be lost.
  - You are about to drop the column `cvUrl` on the `user_profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."job_postedById_idx";

-- AlterTable
ALTER TABLE "public"."job" DROP COLUMN "postedById";

-- AlterTable
ALTER TABLE "public"."job_application" DROP COLUMN "coverLetter";

-- AlterTable
ALTER TABLE "public"."user_profile" DROP COLUMN "cvParsedAt",
DROP COLUMN "cvUrl";
