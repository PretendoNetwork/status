import { getServices } from '../plugins/checker';
import { Prisma } from '../prisma/generated/client';
import { defineLocalCacheEventHandler } from '../utils/cache';
import type { StatusResponse } from '#shared/types';

type LatestCheckResult = {
	id: string;
	check_id: string;
	service_id: string;
	checked_at: string;
	success: boolean;
};

export default defineLocalCacheEventHandler<StatusResponse>('status-cache', 5, async (event) => {
	const prisma = usePrisma(event);
	const services = getServices();

	const latestCheckResults = await prisma.$queryRaw<LatestCheckResult[]>`
		SELECT DISTINCT ON ("check_id")
			"id",
			"check_id",
			"service_id",
			"checked_at",
			"success"
		FROM "check_results"
		WHERE "check_id" in (${Prisma.join(services.flatMap(v => v.checkIds))})
		ORDER BY "check_id", "checked_at" DESC
	`;

	const latestSuccessCheckResults = await prisma.$queryRaw<LatestCheckResult[]>`
		SELECT DISTINCT ON ("check_id")
			"id",
			"check_id",
			"service_id",
			"checked_at",
			"success"
		FROM "check_results"
		WHERE "success" = true
		ORDER BY "check_id", "checked_at" DESC
	`;

	return {
		services: services.map((v) => {
			const checks = latestCheckResults.filter(c => c.service_id === v.id);
			const isHealthy = checks.every(v => v.success);
			const newestHealthyCheckDates = checks
				.map(v => latestSuccessCheckResults.find(c => c.check_id === v.check_id))
				.filter((v): v is LatestCheckResult => !!v)
				.map(v => new Date(v.checked_at).getTime());

			// From the newest success checks, get the furthest back healthy time
			// This is prevent the case where one of the checks always succeeds, but the other one died ages ago.
			// The oldest healthy state *should* corrospond to the actual downtime start
			const lastKnownHealthyTime = Math.min(...newestHealthyCheckDates);

			return {
				id: v.id,
				name: v.name,
				lastHealthyAt: new Date(lastKnownHealthyTime).toISOString(),
				healthy: isHealthy
			};
		})
	};
});
