/*
  Warnings:

  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."user" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'user';

-- CreateTable
CREATE TABLE "public"."user_profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phone" TEXT,
    "location" TEXT,
    "bio" TEXT,
    "experience" TEXT,
    "education" TEXT,
    "cvUrl" TEXT,
    "cvParsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_skill" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "level" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "salary" TEXT,
    "jobType" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "postedById" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job_requirement" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "skillName" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."job_application" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "coverLetter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_userId_key" ON "public"."user_profile"("userId");

-- CreateIndex
CREATE INDEX "user_skill_skillName_idx" ON "public"."user_skill"("skillName");

-- CreateIndex
CREATE UNIQUE INDEX "user_skill_profileId_skillName_key" ON "public"."user_skill"("profileId", "skillName");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "public"."category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "public"."category"("slug");

-- CreateIndex
CREATE INDEX "job_categoryId_isActive_idx" ON "public"."job"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "job_postedById_idx" ON "public"."job"("postedById");

-- CreateIndex
CREATE INDEX "job_requirement_skillName_idx" ON "public"."job_requirement"("skillName");

-- CreateIndex
CREATE UNIQUE INDEX "job_requirement_jobId_skillName_key" ON "public"."job_requirement"("jobId", "skillName");

-- CreateIndex
CREATE INDEX "job_application_userId_status_idx" ON "public"."job_application"("userId", "status");

-- CreateIndex
CREATE INDEX "job_application_jobId_matchScore_idx" ON "public"."job_application"("jobId", "matchScore");

-- CreateIndex
CREATE UNIQUE INDEX "job_application_jobId_userId_key" ON "public"."job_application"("jobId", "userId");

-- AddForeignKey
ALTER TABLE "public"."user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_skill" ADD CONSTRAINT "user_skill_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."user_profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job" ADD CONSTRAINT "job_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_requirement" ADD CONSTRAINT "job_requirement_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_application" ADD CONSTRAINT "job_application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "public"."job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."job_application" ADD CONSTRAINT "job_application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
