import type { DeleteResult } from '#shared/types';

export default defineEventHandler(async (event): Promise<DeleteResult> => {
	enforceApiKey(event);
	const prisma = usePrisma(event);
	const incidentId = getRouterParam(event, 'incident');

	const incident = await prisma.incident.delete({
		where: {
			id: incidentId
		}
	});

	return {
		id: incident.id
	};
});
