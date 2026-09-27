import type { PrismaClient } from '../prisma/generated/client';

// This procedure will rollup every hour into a bucket.
// It takes the last known bucket, then starts at the next hour and rolls up every hour until the current hour.
// This means it will fill in the missing buckets of data even if it hasn't run for a decent amount of time.

async function processHourRollup(prisma: PrismaClient, hourStart: Date) {
	const hourEnd = new Date(hourStart);
	hourEnd.setUTCHours(hourEnd.getUTCHours() + 1);

	await prisma.$transaction(async (tx) => {
		const checks = await tx.checkResult.groupBy({
			by: ['checkId', 'serviceId'],
			where: {
				checkedAt: {
					gte: hourStart,
					lt: hourEnd
				}
			},
			_count: {
				_all: true
			}
		});
		const successChecks = await tx.checkResult.groupBy({
			by: ['checkId'],
			where: {
				success: true,
				checkedAt: {
					gte: hourStart,
					lt: hourEnd
				}
			},
			_count: {
				_all: true
			}
		});

		for (const group of checks) {
			const successCount = successChecks.find(v => v.checkId === group.checkId)?._count?._all ?? 0;
			await tx.checkResultBucket.upsert({
				where: {
					checkId_resolution_timestamp: {
						checkId: group.checkId,
						timestamp: hourStart,
						resolution: 'Hour'
					}
				},
				create: {
					serviceId: group.serviceId,
					checkId: group.checkId,
					timestamp: hourStart,
					resolution: 'Hour',
					totalChecks: group._count._all,
					successChecks: successCount
				},
				update: {
					totalChecks: group._count._all,
					successChecks: successCount
				}
			});
		}
	});
}

export async function rollupHourly(prisma: PrismaClient) {
	const lastCreatedBucket = await prisma.checkResultBucket.findFirst({
		where: {
			resolution: 'Hour'
		},
		orderBy: {
			timestamp: 'desc'
		}
	});

	const endBucket = new Date();
	endBucket.setUTCMinutes(0, 0, 0);

	let bucketStart: Date;

	if (lastCreatedBucket) {
		bucketStart = new Date(lastCreatedBucket.timestamp);
		bucketStart.setUTCHours(bucketStart.getUTCHours() + 1);
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
		bucketStart.setUTCMinutes(0, 0, 0);
	}

	while (bucketStart < endBucket) {
		await processHourRollup(prisma, bucketStart);

		bucketStart.setUTCHours(bucketStart.getUTCHours() + 1);
	}
}
