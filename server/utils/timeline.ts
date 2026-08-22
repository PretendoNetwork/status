import type { CheckResultBucket, PrismaClient } from '../prisma/generated/client';

type TimelineDay = string;
type Timeline = Record<TimelineDay, [total: number, success: number]>;
export type ServiceTimeline = Record<string, Timeline>;

function addBucketToTimeline(timeline: ServiceTimeline, day: string, bucket: CheckResultBucket): ServiceTimeline {
	const serviceTimeline = timeline[bucket.serviceId] ?? {};
	timeline[bucket.serviceId] = serviceTimeline;

	const dayStats = serviceTimeline[day] ?? [0, 0];
	serviceTimeline[day] = dayStats;

	dayStats[0] += bucket.totalChecks;
	dayStats[1] += bucket.successChecks;

	return timeline;
}

export async function getTimelineForRange(prisma: PrismaClient, startDay: Date, endDay: Date): Promise<ServiceTimeline> {
	let output: ServiceTimeline = {};
	const now = new Date();

	// If the day is less than 48 hours ago, switch to hourly buckets
	const cutoff = new Date(now);
	cutoff.setUTCHours(cutoff.getUTCHours() - 48);
	const hourlyStart = new Date(cutoff);
	hourlyStart.setUTCHours(0, 0, 0, 0);

	// Daily buckets
	if (startDay < hourlyStart) {
		const dailyEnd = new Date(Math.min(
			endDay.getTime(),
			hourlyStart.getTime()
		));

		const dailyBuckets = await prisma.checkResultBucket.findMany({
			where: {
				resolution: 'Day',
				timestamp: {
					gte: startDay,
					lt: dailyEnd
				}
			}
		});

		for (const bucket of dailyBuckets) {
			output = addBucketToTimeline(
				output,
				bucket.timestamp.toISOString(),
				bucket
			);
		}
	}

	// Hourly buckets
	if (endDay > hourlyStart) {
		const hourlyStartForQuery = new Date(Math.max(
			startDay.getTime(),
			hourlyStart.getTime()
		));

		const hourlyBuckets = await prisma.checkResultBucket.findMany({
			where: {
				resolution: 'Hour',
				timestamp: {
					gte: hourlyStartForQuery,
					lt: endDay
				}
			}
		});

		for (const bucket of hourlyBuckets) {
			const day = new Date(bucket.timestamp);
			day.setUTCHours(0, 0, 0, 0);
			output = addBucketToTimeline(
				output,
				day.toISOString(),
				bucket
			);
		}
	}

	return output;
}
