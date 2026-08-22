-- CreateEnum
CREATE TYPE "BucketResolution" AS ENUM ('Hour', 'Day');

-- CreateTable
CREATE TABLE "check_result_buckets" (
    "id" BIGSERIAL NOT NULL,
    "check_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "resolution" "BucketResolution" NOT NULL,
    "total_checks" INTEGER NOT NULL,
    "successful_checks" INTEGER NOT NULL,

    CONSTRAINT "check_result_buckets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "check_result_buckets_check_id_resolution_timestamp_key" ON "check_result_buckets"("check_id", "resolution", "timestamp");
