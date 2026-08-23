import { consola } from 'consola';
import { Cron } from 'croner';
import { usePrismaFromConfig } from '../utils/prisma';
import type { PrismaClient } from '../prisma/generated/client';

const maxAgeRawChecks = 5 * 60 * 60 * 1000; // 5 hours
const maxAgeHourlyBuckets = 48 * 60 * 60 * 1000; // 48 hours
const maxAgeDailyBuckets = 90 * 24 * 60 * 60 * 1000; // 90 days

export async function cleanup(prisma: PrismaClient) {
	const rawChecksCutoff = new Date(Date.now() - maxAgeRawChecks);
	const hourlyBucketCutoff = new Date(Date.now() - maxAgeHourlyBuckets);
	const dailyBucketCutoff = new Date(Date.now() - maxAgeDailyBuckets);

	await prisma.$transaction([
		prisma.checkResult.deleteMany({
			where: {
				checkedAt: {
					lt: rawChecksCutoff
				}
			}
		}),
		prisma.checkResultBucket.deleteMany({
			where: {
				resolution: 'Hour',
				timestamp: {
					lt: hourlyBucketCutoff
				}
			}
		}),
		prisma.checkResultBucket.deleteMany({
			where: {
				resolution: 'Day',
				timestamp: {
					lt: dailyBucketCutoff
				}
			}
		})
	]);
}

function startCleanupJob(prisma: PrismaClient) {
	consola.info('Created cleanup job');
	const job = new Cron('33 * * * *', async () => {
		consola.info('Started cleanup');
		await cleanup(prisma);
		consola.success('Finished cleanup');
	}, {
		protect: true,
		catch: (error) => {
			consola.error(`Fatal exception in cleanup job:`, error);
		}
	});

	return {
		close() {
			job.stop();
		}
	};
}

export default defineNitroPlugin((nitroApp) => {
	const config = useRuntimeConfig();
	const prisma = usePrismaFromConfig(config);
	const cleanupJobs = startCleanupJob(prisma);

	nitroApp.hooks.hook('close', () => {
		cleanupJobs.close();
	});
});
