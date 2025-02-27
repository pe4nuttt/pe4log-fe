export default defineNuxtPlugin((nuxtApp) => {
	const userAuth = useCookie('token')
	const config = useRuntimeConfig()

	const $customFetch = $fetch.create({
		baseURL: config.public.baseURL ?? 'https://api.nuxt.com',
		onRequest({ request, options, error }) {
			if (userAuth.value) {
				// Add Authorization header
				options.headers.set('Authorization', `Bearer ${userAuth.value}`)
			}
		},
		onResponse({ response }) {
			// response._data = new myBusinessResponse(response._data)
		},
		// onResponseError({ response }) {
		// 	if (response.status === 401) {
		// 		return nuxtApp.runWithContext(() => navigateTo('/login'))
		// 	}
		// }
		onResponseError({ response }) {
			if (response.status === 401) {
				nuxtApp.runWithContext(() => navigateTo('/sign-in'))
			}
		}
	})

	return {
		provide: {
			customFetch: $customFetch
		}
	}
})
