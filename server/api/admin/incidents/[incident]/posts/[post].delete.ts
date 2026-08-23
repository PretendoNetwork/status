import type { DeleteResult } from '#shared/types';

export default defineEventHandler(async (event): Promise<DeleteResult> => {
	enforceApiKey(event);
	const prisma = usePrisma(event);
	const incidentId = getRouterParam(event, 'incident');
	const postId = getRouterParam(event, 'post');

	const post = await prisma.incidentPost.delete({
		where: {
			id: postId,
			incidentId: incidentId
		}
	});

	return {
		id: post.id
	};
});
