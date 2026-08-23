import { z } from 'zod';
import { mapIncident } from '~~/server/api/admin/incidents.get';
import type { Incident } from '#shared/types';

export const IncidentEditSchema = z.object({
	resolvedAt: z.iso.datetime().nullable().optional()
});

export default defineEventHandler(async (event): Promise<Incident> => {
	enforceApiKey(event);
	const prisma = usePrisma(event);
	const incidentId = getRouterParam(event, 'incident');
	const body = await readValidatedBody(event, IncidentEditSchema.parse);

	const incident = await prisma.incident.update({
		where: {
			id: incidentId
		},
		data: {
			resolvedAt: body.resolvedAt
		},
		include: {
			posts: true
		}
	});

	return mapIncident(incident);
});
