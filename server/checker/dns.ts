import { Resolver } from 'node:dns/promises';
import { z } from 'zod';
import { consola } from 'consola';
import type { CheckCommon, CheckResult } from './setup';

export const DnsCheckSchema = z.object({
	type: z.literal('dns'),
	ip: z.ipv4(),
	domain: z.string()
});

export type DnsCheck = CheckCommon<typeof DnsCheckSchema>;

export async function executeDnsCheck(check: DnsCheck): Promise<CheckResult> {
	try {
		const resolver = new Resolver();
		resolver.setServers([check.options.ip]);
		const addresses = await resolver.resolve4(check.options.domain);

		if (addresses.length === 0) {
			consola.error(`DNS check '${check.options.ip}' for domain '${check.options.domain}' got an empty response`);
			return {
				ok: false
			};
		}

		return {
			ok: true
		};
	} catch (err) {
		consola.error(`Failed to run DNS check '${check.options.ip}' for domain '${check.options.domain}':`, err);
		return {
			ok: false
		};
	}
}
