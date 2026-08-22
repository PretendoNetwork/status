import { Cron } from 'croner';
import { z } from 'zod';
import { consola } from 'consola';
import { executeHttpCheck, HttpCheckSchema } from './http';

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
		HttpCheckSchema
	])
});

export type Check = z.infer<typeof CheckSchema>;

export type CheckResult = {
	ok: boolean;
};

export async function executeCheck(check: Check): Promise<CheckResult> {
	if (check.options.type === 'http') {
		return await executeHttpCheck(check);
	}

	throw new Error('Invalid check type');
}

export async function executeAndSaveCheck(check: Check): Promise<void> {
	try {
		const result = await executeCheck(check);
		console.log('Check result: ', result.ok); // TODO save to database
	} catch (error) {
		consola.error(`Check ${check.id} failed:`, error);
	}
}

export async function createAndStartChecker(checks: Check[]) {
	const jobs = checks.map((check) => {
		consola.success(`Registered check ${check.serviceId}/${check.id} on schedule '${check.schedule}'`);
		return new Cron(check.schedule, async () => {
			await executeAndSaveCheck(check);
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
