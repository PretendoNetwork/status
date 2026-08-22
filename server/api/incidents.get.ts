import type { IncidentList } from '#shared/types';

export default defineEventHandler(async (): Promise<IncidentList> => {
	// TODO get data from db
	return {
		data: [{
			id: '1234',
			startedAt: new Date().toISOString(),
			resolvedAt: null,
			content: {
				id: '1234',
				createdAt: new Date().toISOString(),
				title: 'Its down!',
				body: 'This is the body of an incident'
			}
		}]
	};
});
