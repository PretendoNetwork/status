import dgram from 'node:dgram';
import crypto from 'node:crypto';
import { consola } from 'consola';
import { z } from 'zod';
import type { CheckCommon, CheckResult } from './setup';

export const UdpEchoCheckSchema = z.object({
	type: z.literal('udp-echo'),
	ip: z.string(),
	port: z.number()
});

const socket = dgram.createSocket('udp4');
const socketTimeout = 5 * 1000; // 5 seconds

export type UdpEchoCheck = CheckCommon<typeof UdpEchoCheckSchema>;

export async function executeUdpEchoCheck(check: UdpEchoCheck): Promise<CheckResult> {
	try {
		await new Promise<void>((resolve, reject) => {
			const uuid = crypto.randomUUID();

			const timeout = setTimeout(() => {
				close();
				reject(new Error('No valid response received'));
			}, socketTimeout);

			function close() {
				socket.removeListener('message', listener);
				clearTimeout(timeout);
			}

			function listener(msg: Buffer) {
				const incomingUuid = msg.toString('utf8');
				if (uuid === incomingUuid) {
					close();
					resolve();
				}
			}

			socket.on('message', listener);

			socket.send(Buffer.from(uuid, 'utf8'), check.options.port, check.options.ip, (error) => {
				if (error) {
					close();
					reject(error);
				}
			});
		});
		return {
			ok: true
		};
	} catch (err) {
		consola.error(`UDP echo check '${check.options.ip}:${check.options.port}' failed:`, err);
		return {
			ok: false
		};
	}
}
