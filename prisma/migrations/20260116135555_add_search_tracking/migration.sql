-- CreateTable
CREATE TABLE "public"."SearchQuery" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "resultsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SearchQuery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SearchQuery_query_createdAt_idx" ON "public"."SearchQuery"("query", "createdAt");

-- CreateIndex
CREATE INDEX "SearchQuery_createdAt_idx" ON "public"."SearchQuery"("createdAt");
