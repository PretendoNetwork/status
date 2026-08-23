import { z } from 'zod';
import { nanoid } from 'nanoid';
import { mapIncident } from '../../incidents.get';
import type { Incident } from '#shared/types';

export const IncidentPostCreateSchema = z.object({
	title: z.string().trim().min(1),
	body: z.string().trim().min(1).nullable().default(null)
});

export default defineEventHandler(async (event): Promise<Incident> => {
	enforceApiKey(event);
	const prisma = usePrisma(event);
	const incidentId = getRouterParam(event, 'incident');
	const body = await readValidatedBody(event, IncidentPostCreateSchema.parse);

	await prisma.incidentPost.create({
		data: {
			id: nanoid(),
			incidentId: incidentId ?? '',
			title: body.title,
			body: body.body ?? null
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
