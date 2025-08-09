import { PREFERENCE_KEYS } from '~/utils/constants'

export default defineNuxtPlugin(async () => {
	const userStore = useUserStore()
	const { $api } = useNuxtApp()
	const accessToken = useCookie(PREFERENCE_KEYS.ACCESS_TOKEN) // Get token from cookies

	await callOnce(async () => {
		if (!accessToken.value) return userStore.clearUser()

		try {
			const { data } = await $api.users.getCurrentUser()
			userStore.setUser(data)
		} catch (err) {
			userStore.clearUser()
		}
	})
})
