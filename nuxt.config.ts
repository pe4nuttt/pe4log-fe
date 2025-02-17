// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: [
		'@nuxtjs/tailwindcss',
		'shadcn-nuxt',
		'@nuxt/eslint',
		'@nuxtjs/color-mode',
		'@nuxtjs/google-fonts',
		'@nuxt/icon'
	],
	shadcn: {
		/**
		 * Prefix for all the imported component
		 */
		prefix: '',
		/**
		 * Directory that the component lives in.
		 * @default "./components/ui"
		 */
		componentDir: './components/ui'
	},

	tailwindcss: {
		cssPath: ['~/assets/styles/tailwind.scss', { injectPosition: 'last' }]
	},

	colorMode: {
		preference: 'system', // default value of $colorMode.preference
		fallback: 'dark', // fallback value if not system preference found
		hid: 'nuxt-color-mode-script',
		globalName: '__NUXT_COLOR_MODE__',
		componentName: 'ColorScheme',
		classPrefix: '',
		classSuffix: '',
		storage: 'localStorage', // or 'sessionStorage' or 'cookie'
		storageKey: 'nuxt-color-mode'
	},

	googleFonts: {
		families: {
			'IBM Plex Mono': '200..700'
		}
	},

	eslint: {}
})
