export default defineNuxtRouteMiddleware((to, from) => {
	if (import.meta.server) return

	const userStore = useUserStore()
	const { user } = storeToRefs(userStore)

	const roles = to.meta.roles
	if (!roles) return

	const requiredRoles = Array.isArray(roles) ? roles : [roles]

	if (!user.value) {
		return navigateTo('/auth/sign-in')
	}

	if (requiredRoles && !requiredRoles.includes(user.value.role)) {
		return abortNavigation({
			statusCode: 403,
			statusMessage: 'You are not authorized to view this page'
		})
	}
})
