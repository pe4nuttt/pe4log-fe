import { $fetch } from 'ofetch'
import type { FetchOptions } from 'ofetch'
import AuthModule from '~/repository/modules/auth'
import CategoriesModule from '~/repository/modules/categories'
import FilesModule from '~/repository/modules/files'
import PostsModule from '~/repository/modules/posts'
import TagsModule from '~/repository/modules/tags'
import UserModule from '~/repository/modules/user'
import { PREFERENCE_KEYS } from '~/utils/constants'

interface IApiInstace {
	auth: AuthModule
	user: UserModule
	categories: CategoriesModule
	tags: TagsModule
	posts: PostsModule
	files: FilesModule
}

let refreshTokenPromise: Promise<string | null> | null = null

export default defineNuxtPlugin((nuxtApp) => {
	const accessToken = useCookie(PREFERENCE_KEYS.ACCESS_TOKEN)
	const refreshToken = useCookie(PREFERENCE_KEYS.REFRESH_TOKEN)

	const fetchOptions: FetchOptions = {
		baseURL: nuxtApp.$config.public.baseURL,
		onRequest({ request, options, error }) {
			if (accessToken.value) {
				options.headers.set('Authorization', `Bearer ${accessToken.value}`)
			}
		},
		async onResponseError({ response, options, request }) {
			// if (response.status === 401) {

			// 	await nuxtApp.runWithContext(() => navigateTo('/auth/sign-in'))
			// }

			if (response.status === 401) {
				// ✅ If there's no ongoing refresh request, start one
				if (!refreshTokenPromise) {
					refreshTokenPromise = refreshAccessToken().then((newAccessToken) => {
						refreshTokenPromise = null // Reset after resolving
						return newAccessToken
					})
				}

				// ✅ Wait for the refresh process to complete, then retry the failed request
				const res = refreshTokenPromise.then(async (newAccessToken) => {
					if (newAccessToken) {
						options.headers = {
							...options.headers
						}
						options.headers.set('Authorization', `Bearer ${newAccessToken}`)

						return $fetch(request, options) // Retry original request
					}
					await nuxtApp.runWithContext(() => navigateTo('/auth/sign-in'))
					return Promise.reject(
						new Error('Refresh token expired, redirecting...')
					)
				})

				return res
			}

			throw {
				success: response._data?.success || false,
				message: response._data?.message || 'Something went wrong',
				errors: response._data?.errors || {},
				code: response._data?.code || response.status || 500
			}
		}
	}

	const apiFetcher = $fetch.create(fetchOptions)

	const modules: IApiInstace = {
		auth: new AuthModule(apiFetcher),
		user: new UserModule(apiFetcher),
		categories: new CategoriesModule(apiFetcher),
		tags: new TagsModule(apiFetcher),
		posts: new PostsModule(apiFetcher),
		files: new FilesModule(apiFetcher)
	}

	return {
		provide: {
			api: modules,
			apiFetcher: apiFetcher
		}
	}
})

async function refreshAccessToken(): Promise<string | null> {
	const accessToken = useCookie(PREFERENCE_KEYS.ACCESS_TOKEN)
	const refreshToken = useCookie(PREFERENCE_KEYS.REFRESH_TOKEN)
	const { logout } = useAuth()

	if (!refreshToken.value) {
		return null
	}

	try {
		const response = await $fetch('/auth/refresh', {
			method: 'POST',
			baseURL: useRuntimeConfig().public.baseURL,
			headers: {
				Authorization: `Bearer ${refreshToken.value}`
			}
		})

		if (response?.success && response?.data?.accessToken) {
			// Update stored tokens
			accessToken.value = response.data.accessToken
			refreshToken.value = response.data.refreshToken

			return response.data.accessToken
		}
	} catch (error) {
		logout()
		console.error('Failed to refresh access token:', error)
	}

	return null
}
