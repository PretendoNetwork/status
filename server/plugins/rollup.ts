import { consola } from 'consola';
import { Cron } from 'croner';
import { usePrismaFromConfig } from '../utils/prisma';
import { rollupHourly } from '../rollup/hourly';
import { rollupDaily } from '../rollup/daily';
import type { PrismaClient } from '../prisma/generated/client';

function startRollupJobs(prisma: PrismaClient) {
	consola.info('Created hourly rollup');
	const hourlyJob = new Cron('12,42 * * * *', async () => {
		await rollupHourly(prisma);
	}, {
		protect: true,
		catch: (error) => {
			consola.error(`Fatal exception for hourly rollup:`, error);
		}
	});

	consola.info('Created daily rollup');
	const dailyJob = new Cron('50 0,12 * * *', async () => {
		await rollupDaily(prisma);
	}, {
		protect: true,
		catch: (error) => {
			consola.error(`Fatal exception for daily rollup:`, error);
		}
	});

	return {
		close() {
			hourlyJob.stop();
			dailyJob.stop();
		}
	};
}

export default defineNitroPlugin((nitroApp) => {
	const config = useRuntimeConfig();
	const prisma = usePrismaFromConfig(config);
	const rollupJobs = startRollupJobs(prisma);

	nitroApp.hooks.hook('close', () => {
		rollupJobs.close();
	});
});
