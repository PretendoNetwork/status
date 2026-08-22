import NodeCache from 'node-cache';
import type { H3Event } from 'h3';

const cache = new NodeCache({
	useClones: false
});

export function getCache() {
	return cache;
}

export function defineLocalCacheEventHandler<T>(key: string, ttl: number, cb: (event: H3Event) => Promise<T>): (event: H3Event) => Promise<T> {
	return defineEventHandler(async (event) => {
		const cache = getCache();
		const cachedResponse = cache.get<T>(key);
		if (cachedResponse) {
			return cachedResponse;
		}

		const out = await cb(event);
		cache.set<T>(key, out, ttl);
		return out;
	});
}
