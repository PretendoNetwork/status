import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/client';
import type { H3Event } from 'h3';

let prisma: PrismaClient | null = null;

export function usePrisma(event: H3Event): PrismaClient {
	if (!prisma) {
		const config = useRuntimeConfig(event);
		if (config.databaseUrl) {
			throw new Error('Database URL is required');
		}
		const adapter = new PrismaPg({
			connectionString: config.databaseUrl
		});
		prisma = new PrismaClient({
			adapter
		});
	}

	return prisma;
}
