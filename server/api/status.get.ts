import { getServices } from '../plugins/checker';
import type { StatusResponse } from '#shared/types';

export default defineEventHandler(async (): Promise<StatusResponse> => {
	const services = getServices();
	return {
		services: services.map(v => ({
			id: v.id,
			name: v.name,
			healthy: true // TODO get data from db
		}))
	};
});
