import type { H3Event } from 'h3';

export function enforceApiKey(event: H3Event) {
	const authHeader = getHeader(event, 'authorization');
	if (!authHeader) {
		throw createError({
			status: 401,
			message: 'Authentication is required'
		});
	}

	const config = useRuntimeConfig(event);
	const isValidApiKey = authHeader === `Bearer ${config.apiKey}`;
	if (!config.apiKey || !isValidApiKey) {
		throw createError({
			status: 403,
			message: 'You do not have permission to do this action'
		});
	}
}
