-- CreateEnum
CREATE TYPE "IncidentType" AS ENUM ('Incident', 'Notice', 'Maintenance');

-- AlterTable
ALTER TABLE "incidents" ADD COLUMN     "type" "IncidentType" NOT NULL DEFAULT 'Incident';
