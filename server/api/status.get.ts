import { getServices } from '../plugins/checker';
import type { StatusResponse } from '#shared/types';

type LatestCheckResult = {
	id: string;
	check_id: string;
	service_id: string;
	executed_at: string;
	success: boolean;
};

export default defineEventHandler(async (event): Promise<StatusResponse> => {
	const prisma = usePrisma(event);

	const latestCheckResults = await prisma.$queryRaw<LatestCheckResult[]>`
		SELECT DISTINCT ON ("check_id")
			"id",
			"check_id",
			"service_id",
			"executed_at",
			"success"
		FROM "check_results"
		ORDER BY "check_id", "executed_at" DESC
	`;

	const services = getServices();
	return {
		services: services.map((v) => {
			const checks = latestCheckResults.filter(c => c.service_id === v.id);
			const isHealthy = checks.every(v => v.success);

			return {
				id: v.id,
				name: v.name,
				healthy: isHealthy
			};
		})
	};
});
