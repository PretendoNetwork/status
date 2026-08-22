import { z } from 'zod';
import { consola } from 'consola';
import type { CheckCommon, CheckResult } from './setup';

export const HttpCheckSchema = z.object({
	type: z.literal('http'),
	url: z.url()
});

export type HttpCheck = CheckCommon<typeof HttpCheckSchema>;

export async function executeHttpCheck(check: HttpCheck): Promise<CheckResult> {
	try {
		const response = await fetch(check.options.url, {
			method: 'GET',
			headers: {
				'User-Agent': 'PretendoStatus/1.0'
			}
		});
		const isValidResponse = response.status >= 200 && response.status < 400;
		if (!isValidResponse) {
			consola.error(`HTTP check '${check.options.url}' failed with negative response code: ${response.status}`);
		}
		return {
			ok: isValidResponse
		};
	} catch (err) {
		consola.error(`Failed to run HTTP check '${check.options.url}':`, err);
		return {
			ok: false
		};
	}
}
