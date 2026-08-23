import { z } from 'zod';
import { nanoid } from 'nanoid';
import { mapIncident } from './incidents.get';
import { IncidentPostCreateSchema } from './incidents/[incident]/posts.post';
import type { Incident } from '#shared/types';

const IncidentCreateSchema = z.object({
	startedAt: z.iso.datetime().optional(),
	resolvedAt: z.iso.datetime().nullable().optional(),
	post: IncidentPostCreateSchema
});

export default defineEventHandler(async (event): Promise<Incident> => {
	enforceApiKey(event);
	const prisma = usePrisma(event);
	const body = await readValidatedBody(event, IncidentCreateSchema.parse);

	const incident = await prisma.incident.create({
		data: {
			id: nanoid(),
			startedAt: body.startedAt ?? new Date(),
			resolvedAt: body.resolvedAt ?? null,
			posts: {
				create: {
					id: nanoid(),
					title: body.post.title,
					body: body.post.body ?? null
				}
			}
		},
		include: {
			posts: true
		}
	});

	return mapIncident(incident);
});
