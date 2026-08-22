export default defineNuxtConfig({
	compatibilityDate: '2026-08-07',
	srcDir: './src',
	dir: {
		public: './src/public'
	},

	modules: [
		'@nuxt/eslint',
		'@nuxt/fonts',
		'@nuxt/icon'
	],

	eslint: {
		config: {
			standalone: false
		}
	},

	runtimeConfig: {
		nitro: {
			envPrefix: 'PN_STATUS_'
		},

		public: {
			homePageUrl: 'https://pretendo.network'
		}
	},

	fonts: {
		defaults: {
			weights: [400, 700],
			styles: ['normal', 'italic']
		}
	},

	icon: {
		clientBundle: {
			scan: true
		},
		provider: 'none',
		serverBundle: 'local'
	},

	components: [
		{
			path: '~/components',
			pathPrefix: false
		}
	]
});
