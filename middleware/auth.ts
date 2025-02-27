import { EUserRole } from '~/types'
import { PREFERENCE_KEYS } from '~/utils/constants'

const authRoutes = new Set(['/auth/sign-in', '/auth/sign-up'])

export default defineNuxtRouteMiddleware((to, from) => {
	const accessToken = useCookie(PREFERENCE_KEYS.ACCESS_TOKEN)
	// const userStore = useUserStore()
	// const { user } = storeToRefs(userStore)

	if (accessToken.value) {
		if (authRoutes.has(to.fullPath)) {
			return navigateTo('/', {
				replace: true
			})
		}

		return
	}

	if (authRoutes.has(to.path)) return

	return navigateTo('/auth/sign-in', {
		replace: true
	})
})
