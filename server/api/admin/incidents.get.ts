import { mapIncidentType } from '../incidents/[incident].get';
import type { Incident, IncidentList } from '#shared/types';
import type * as Prisma from '../../prisma/generated/client';

export function mapIncident(v: Prisma.Incident & { posts: Prisma.IncidentPost[] }): Incident {
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

export default defineEventHandler(async (event): Promise<IncidentList> => {
	enforceApiKey(event);
	const prisma = usePrisma(event);

	// TODO some kind of pagination or filtering
	const incidents = await prisma.incident.findMany({
		include: {
			posts: true
		}
	});

	return {
		data: incidents.map(mapIncident)
	};
});
