import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { z } from 'zod';
import { consola } from 'consola';
import { CheckSchema, createAndStartChecker } from '../checker/setup';

let checkerClose: null | (() => void) = null;
let services: z.infer<typeof ServiceSchema>[] = [];

export const ServiceSchema = z.object({
	id: z.string(),
	name: z.string()
});

async function startChecker(configFile: string) {
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
		services = config.services;

		const checker = await createAndStartChecker(config.checks);
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
	startChecker(config.checkConfigFile);
	nitroApp.hooks.hook('close', () => {
		checkerClose?.();
	});
});
