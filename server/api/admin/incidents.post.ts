import { z } from 'zod';
import { nanoid } from 'nanoid';
import { mapIncident } from './incidents.get';
import { IncidentPostCreateSchema } from './incidents/[incident]/posts.post';
import type * as Prisma from '~~/server/prisma/generated/client';
import type { Incident, IncidentType } from '#shared/types';

export const IncidentTypeSchema = z.enum(['incident', 'maintenance', 'notice']);
const IncidentCreateSchema = z.object({
	startedAt: z.iso.datetime().optional(),
	resolvedAt: z.iso.datetime().nullable().optional(),
	showAt: z.iso.datetime().optional(),
	type: IncidentTypeSchema.default('incident'),
	post: IncidentPostCreateSchema
});

const incidentTypeMap: Record<IncidentType, Prisma.IncidentType> = {
	incident: 'Incident',
	maintenance: 'Maintenance',
	notice: 'Notice'
};

export function mapIncidentTypeToDb(type: IncidentType): Prisma.IncidentType {
	return incidentTypeMap[type];
}

export default defineEventHandler(async (event): Promise<Incident> => {
	enforceApiKey(event);
	const prisma = usePrisma(event);
	const body = await readValidatedBody(event, IncidentCreateSchema.parse);

	const incident = await prisma.incident.create({
		data: {
			id: nanoid(),
			startedAt: body.startedAt ?? new Date(),
			showAt: body.showAt ?? new Date(),
			resolvedAt: body.resolvedAt ?? null,
			type: mapIncidentTypeToDb(body.type),
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
