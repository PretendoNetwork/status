import { z } from 'zod';
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
		return {
			ok: response.status >= 200 && response.status < 400
		};
	} catch {
		return {
			ok: false
		};
	}
}
