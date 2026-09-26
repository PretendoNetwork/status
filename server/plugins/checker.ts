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
let components: Array<z.infer<typeof ComponentSchema>> = [];

export const ServiceSchema = z.object({
	id: z.string(),
	name: z.string(),
	hideHistory: z.boolean().default(false)
});

const ServiceListComponentSchema = z.object({
	type: z.literal('svclist'),
	services: z.array(z.string().min(1)).default([])
});

const GroupComponentSchema = z.object({
	type: z.literal('group'),
	title: z.string().min(1).optional(),
	subtitle: z.string().min(1).optional(),
	services: z.array(z.string().min(1)).default([])
});

const ComponentSchema = z.discriminatedUnion('type', [
	GroupComponentSchema,
	ServiceListComponentSchema
]);

const ConfigSchema = z.object({
	components: z.array(ComponentSchema).default([]),
	services: z.array(ServiceSchema).default([]),
	checks: z.array(CheckSchema).default([])
});

async function startChecker(prisma: PrismaClient, configFile: string) {
	consola.info('Starting checker');
	try {
		const resolvedPath = resolve(configFile);
		console.info('Loading config from:', resolvedPath);
		const fileContents = await readFile(resolvedPath, 'utf8');
		const config = ConfigSchema.parse(JSON.parse(fileContents));
		services = config.services.map(v => ({
			...v,
			checkIds: config.checks.filter(c => c.serviceId === c.serviceId).map(v => v.id)
		}));

		components = config.components;
		if (components.length === 0) {
			components = [{
				type: 'svclist',
				services: services.map(v => v.id)
			}];
		}

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

export function getComponents() {
	return components;
}

export default defineNitroPlugin((nitroApp) => {
	const config = useRuntimeConfig();
	const prisma = usePrismaFromConfig(config);
	startChecker(prisma, config.checkConfigFile);
	nitroApp.hooks.hook('close', () => {
		checkerClose?.();
	});
});
