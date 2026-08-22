import { Cron } from 'croner';
import { z } from 'zod';
import { consola } from 'consola';
import { executeHttpCheck, HttpCheckSchema } from './http';
import { executeUdpEchoCheck, UdpEchoCheckSchema } from './udp-echo';
import type { PrismaClient } from '../prisma/generated/client';
import type { HttpCheck } from './http';
import type { UdpEchoCheck } from './udp-echo';

export type CheckCommon<TSchema = any> = {
	id: string;
	serviceId: string;
	schedule: string;
	options: z.infer<TSchema>;
};

export const CheckSchema = z.object({
	id: z.string(),
	serviceId: z.string(),
	schedule: z.string(),
	options: z.discriminatedUnion('type', [
		HttpCheckSchema,
		UdpEchoCheckSchema
	])
});

export type Check = z.infer<typeof CheckSchema>;

export type CheckResult = {
	ok: boolean;
};

export async function executeCheck(check: Check): Promise<CheckResult> {
	if (check.options.type === 'http') {
		return await executeHttpCheck(check as HttpCheck);
	}
	if (check.options.type === 'udp-echo') {
		return await executeUdpEchoCheck(check as UdpEchoCheck);
	}

	throw new Error('Invalid check type');
}

export async function executeAndSaveCheck(prisma: PrismaClient, check: Check): Promise<void> {
	const checkedAt = new Date();
	let isOk = false;
	try {
		const result = await executeCheck(check);
		isOk = result.ok;
	} catch (error) {
		consola.error(`Check ${check.id} failed:`, error);
	} finally {
		const doneAt = new Date();
		await prisma.checkResult.createMany({
			data: [{
				checkId: check.id,
				serviceId: check.serviceId,
				checkedAt: checkedAt,
				durationMs: doneAt.getTime() - checkedAt.getTime(),
				success: isOk
			}]
		});
	}
}

export async function createAndStartChecker(prisma: PrismaClient, checks: Check[]) {
	const jobs = checks.map((check) => {
		consola.success(`Registered check ${check.serviceId}/${check.id} on schedule '${check.schedule}'`);
		return new Cron(check.schedule, async () => {
			await executeAndSaveCheck(prisma, check);
		}, {
			protect: true, // Prevent jobs from overlapping
			catch: (error) => {
				consola.error(`Fatal exception for check ${check.id}:`, error); // Final boundary to prevent crash
			}
		});
	});

	return {
		close() {
			for (const job of jobs) {
				job.stop();
			}
		}
	};
}
