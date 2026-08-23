import { z } from 'zod';
import { mapIncident } from '~~/server/api/admin/incidents.get';
import type { Incident } from '#shared/types';

export const IncidentPostEditSchema = z.object({
	title: z.string().trim().min(1).optional(),
	body: z.string().trim().min(1).nullable().optional()
});

export default defineEventHandler(async (event): Promise<Incident> => {
	enforceApiKey(event);
	const prisma = usePrisma(event);
	const incidentId = getRouterParam(event, 'incident');
	const postId = getRouterParam(event, 'post');
	const body = await readValidatedBody(event, IncidentPostEditSchema.parse);

	await prisma.incidentPost.update({
		where: {
			id: postId,
			incidentId: incidentId
		},
		data: {
			title: body.title,
			body: body.body
		}
	});
	const incident = await prisma.incident.findFirstOrThrow({
		where: {
			id: incidentId
		},
		include: {
			posts: true
		}
	});

	return mapIncident(incident);
});
