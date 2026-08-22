import { z } from 'zod';
import type { CheckCommon, CheckResult } from './setup';

export const HttpCheckSchema = z.object({
	type: z.literal('http'),
	url: z.url()
});

export type HttpCheck = CheckCommon<typeof HttpCheckSchema>;

export async function executeHttpCheck(check: HttpCheck): Promise<CheckResult> {
	console.log('Doing HTTP check', check); // TODO do real check
	return {
		ok: true
	};
}
