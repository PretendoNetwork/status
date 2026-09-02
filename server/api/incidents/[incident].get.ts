import type { IncidentType, PublicIncident } from '#shared/types';
import type * as Prisma from '../../prisma/generated/client';

const incidentTypeMap: Record<Prisma.IncidentType, IncidentType> = {
	Incident: 'incident',
	Maintenance: 'maintenance',
	Notice: 'notice'
};

export function mapIncidentType(type: Prisma.IncidentType): IncidentType {
	return incidentTypeMap[type];
}

export function mapPublicIncident(v: Prisma.Incident & { posts: Prisma.IncidentPost[] }): PublicIncident {
	const sortedPosts = [...v.posts].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
	return {
		id: v.id,
		startedAt: v.startedAt.toISOString(),
		resolvedAt: v.resolvedAt?.toISOString() ?? null,
		type: mapIncidentType(v.type),
		posts: sortedPosts.map(post => ({
			id: post.id,
			createdAt: post.createdAt.toISOString(),
			title: post.title,
			body: post.body ?? null
		}))
	};
}

export default defineEventHandler(async (event): Promise<PublicIncident> => {
	const prisma = usePrisma(event);

	const incident = await prisma.incident.findFirst({
		include: {
			posts: {
				orderBy: {
					createdAt: 'asc'
				}
			}
		}
	});
	if (!incident) {
		throw createError({
			status: 404
		});
	}

	return mapPublicIncident(incident);
});
