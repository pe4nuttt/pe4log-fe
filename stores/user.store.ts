import type { IApiReponse, IUser } from '~/types'
import { PREFERENCE_KEYS } from '~/utils/constants'

export const useUserStore = defineStore('user', () => {
	const { $api } = useNuxtApp()

	const user = ref<IUser | null>()
	const accessToken = useCookie(PREFERENCE_KEYS.ACCESS_TOKEN) // Get token from cookies

	// const { data, error, status } = useAsyncData<IApiReponse<IUser> | null>(
	// 	'user',
	// 	() =>
	// 		accessToken.value
	// 			? $api.users.getCurrentUser()
	// 			: new Promise((resolve) => resolve(null)),
	// 	{
	// 		immediate: !!accessToken.value, // Fetch only if accessToken exists
	// 		watch: [accessToken], // Refetch if accessToken changes,
	// 		server: false
	// 	}
	// )

	function setUser(newUser: IUser | null) {
		user.value = newUser
	}

	function clearUser() {
		user.value = null
	}

	// watchEffect(() => {
	// 	if (data.value?.data) {
	// 		setUser(data.value?.data)
	// 	} else {
	// 		clearUser()
	// 	}
	// })

	return {
		user,
		setUser,
		clearUser
	}
})
