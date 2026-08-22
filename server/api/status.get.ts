import type { StatusResponse } from '#shared/types';

export default defineEventHandler(async (): Promise<StatusResponse> => {
	return {
		services: [{
			id: 'web',
			name: 'Website',
			healthy: true
		}, {
			id: 'forum',
			name: 'Community forum',
			healthy: false
		}]
	};
});
