import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
	schema: 'server/prisma/schema.prisma',
	migrations: {
		path: 'server/prisma/migrations'
	},
	datasource: {
		url: process.env['PN_STATUS_DATABASE_URL']
	}
});
