import type { IncidentList } from '#shared/types';

export default defineEventHandler(async (event): Promise<IncidentList> => {
	const prisma = usePrisma(event);

	const activeIncidents = await prisma.incident.findMany({
		where: {
			resolvedAt: null
		},
		include: {
			posts: true
		}
	});

	return {
		data: activeIncidents.map((v) => {
			const sortedPosts = [...v.posts].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
			return {
				id: v.id,
				startedAt: v.startedAt.toISOString(),
				resolvedAt: v.resolvedAt?.toISOString() ?? null,
				posts: sortedPosts.map(post => ({
					id: post.id,
					createdAt: post.createdAt.toISOString(),
					title: post.title,
					body: post.body ?? null
				}))
			};
		})
	};
});
