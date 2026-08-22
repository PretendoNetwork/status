-- CreateTable
CREATE TABLE "incident_posts" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "incidentId" TEXT NOT NULL,

    CONSTRAINT "incident_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "check_results" (
    "id" BIGSERIAL NOT NULL,
    "check_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "checked_at" TIMESTAMP(3) NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,

    CONSTRAINT "check_results_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "incident_posts" ADD CONSTRAINT "incident_posts_incidentId_fkey" FOREIGN KEY ("incidentId") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
