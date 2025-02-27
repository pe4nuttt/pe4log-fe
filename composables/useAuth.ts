import { useAppToast } from './useAppToast'

export function useAuth() {
	const { $api } = useNuxtApp()
	const userStore = useUserStore()
	const { setTokens, clearTokens } = useToken()
	const { toastSuccess, toastError } = useAppToast()
	const isLoggingIn = ref(false)

	async function login(data: { email: string; password: string }) {
		try {
			isLoggingIn.value = true
			const response = await $api.auth.login(data)
			if (response.success && response.data) {
				const { accessToken, refreshToken, user } = response.data
				setTokens({ accessToken, refreshToken })
				userStore.setUser(user)
				toastSuccess('Login successfully!')
				isLoggingIn.value = false

				return response
			}
		} catch (error) {
			isLoggingIn.value = false
			toastError(error)
			throw error
		}
	}

	function logout() {
		clearTokens()
		userStore.setUser(null)
	}

	return {
		login,
		logout,
		isLoggingIn
	}
}
