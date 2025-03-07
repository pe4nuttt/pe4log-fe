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
		'@nuxt/icon',
		'@nuxtjs/i18n',
		'@pinia/nuxt',
		'pinia-plugin-persistedstate/nuxt',
		'dayjs-nuxt'
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
			'IBM Plex Mono': [200, 300, 400, 500, 600, 700],
			Inter: [200, 300, 400, 500, 600, 700]
		}
	},

	i18n: {
		locales: [
			{
				code: 'en',
				file: 'en.json'
			},
			{
				code: 'vi',
				file: 'vi.json'
			}
		],
		lazy: true,
		defaultLocale: 'en',
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'i18n_redirected',
			redirectOn: 'root'
		},
		compilation: {
			strictMessage: false,
			escapeHtml: false
		}
	},

	eslint: {},

	runtimeConfig: {
		public: {
			baseURL: process.env.BASE_URL || 'https://api.example.com/'
		}
	}
})
