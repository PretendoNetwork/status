import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { z } from 'zod';
import { consola } from 'consola';
import { CheckSchema, createAndStartChecker } from '../checker/setup';
import { usePrismaFromConfig } from '../utils/prisma';
import type { PrismaClient } from '../prisma/generated/client';

let checkerClose: null | (() => void) = null;
let services: Array<z.infer<typeof ServiceSchema> & {
	checkIds: string[];
}> = [];

export const ServiceSchema = z.object({
	id: z.string(),
	name: z.string(),
	hideHistory: z.boolean().default(false)
});

async function startChecker(prisma: PrismaClient, configFile: string) {
	consola.info('Starting checker');
	try {
		const resolvedPath = resolve(configFile);
		console.info('Loading config from:', resolvedPath);
		const fileContents = await readFile(resolvedPath, 'utf8');
		const schema = z.object({
			services: z.array(ServiceSchema),
			checks: z.array(CheckSchema)
		});
		const config = schema.parse(JSON.parse(fileContents));
		services = config.services.map(v => ({
			...v,
			checkIds: config.checks.filter(c => c.serviceId === c.serviceId).map(v => v.id)
		}));

		const checker = await createAndStartChecker(prisma, config.checks);
		consola.success('Checker started');
		checkerClose = () => {
			checker.close();
			console.info('Checker closed');
		};
	} catch (err) {
		console.error('Checker crashed', err);
	}
}

export function getServices() {
	return services;
}

export default defineNitroPlugin((nitroApp) => {
	const config = useRuntimeConfig();
	const prisma = usePrismaFromConfig(config);
	startChecker(prisma, config.checkConfigFile);
	nitroApp.hooks.hook('close', () => {
		checkerClose?.();
	});
});
