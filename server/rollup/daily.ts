import type { PrismaClient } from '../prisma/generated/client';

// This procedure will rollup every day into a bucket.
// It functions the same as `hourly.ts` but uses hourly buckets as input

async function processDayRollup(prisma: PrismaClient, dayStart: Date) {
	const dayEnd = new Date(dayStart);
	dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

	await prisma.$transaction(async (tx) => {
		const hourBuckets = await tx.checkResultBucket.groupBy({
			by: ['checkId', 'serviceId'],
			where: {
				resolution: 'Hour',
				timestamp: {
					gte: dayStart,
					lt: dayEnd
				}
			},
			_sum: {
				successChecks: true,
				totalChecks: true
			}
		});

		for (const group of hourBuckets) {
			await tx.checkResultBucket.upsert({
				where: {
					checkId_resolution_timestamp: {
						checkId: group.checkId,
						timestamp: dayStart,
						resolution: 'Day'
					}
				},
				create: {
					serviceId: group.serviceId,
					checkId: group.checkId,
					timestamp: dayStart,
					resolution: 'Day',
					totalChecks: group._sum.totalChecks ?? 0,
					successChecks: group._sum.successChecks ?? 0
				},
				update: {
					totalChecks: group._sum.totalChecks ?? 0,
					successChecks: group._sum.successChecks ?? 0
				}
			});
		}
	});
}

export async function rollupDaily(prisma: PrismaClient) {
	const lastCreatedDailyBucket = await prisma.checkResultBucket.findFirst({
		where: {
			resolution: 'Day'
		},
		orderBy: {
			timestamp: 'desc'
		}
	});

	const endBucket = new Date();
	endBucket.setUTCHours(0, 0, 0, 0);

	let bucketStart: Date;

	if (lastCreatedDailyBucket) {
		bucketStart = new Date(lastCreatedDailyBucket.timestamp);
		bucketStart.setUTCDate(bucketStart.getUTCDate() + 1);
	} else {
		const firstCheck = await prisma.checkResult.findFirst({
			orderBy: {
				checkedAt: 'asc'
			}
		});

		if (!firstCheck) {
			return; // Nothing to do, no checks
		}

		bucketStart = new Date(firstCheck.checkedAt);
		bucketStart.setUTCHours(0, 0, 0, 0);
	}

	while (bucketStart < endBucket) {
		await processDayRollup(prisma, bucketStart);

		bucketStart.setUTCDate(bucketStart.getUTCDate() + 1);
	}
}
