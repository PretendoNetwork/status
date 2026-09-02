import { z } from 'zod';
import { mapIncident } from '~~/server/api/admin/incidents.get';
import { IncidentTypeSchema, mapIncidentTypeToDb } from '../incidents.post';
import type { Incident } from '#shared/types';

export const IncidentEditSchema = z.object({
	resolvedAt: z.iso.datetime().nullable().optional(),
	type: IncidentTypeSchema.optional()
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
			resolvedAt: body.resolvedAt,
			type: body.type ? mapIncidentTypeToDb(body.type) : undefined
		},
		include: {
			posts: true
		}
	});

	return mapIncident(incident);
});
