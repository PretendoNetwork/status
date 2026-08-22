import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../prisma/generated/client';
import type { H3Event } from 'h3';
import type { NitroRuntimeConfig } from 'nitropack/types';

let prisma: PrismaClient | null = null;

export function usePrisma(event: H3Event): PrismaClient {
	const config = useRuntimeConfig(event);
	return usePrismaFromConfig(config);
}

export function usePrismaFromConfig(config: NitroRuntimeConfig): PrismaClient {
	if (!prisma) {
		if (!config.databaseUrl) {
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
