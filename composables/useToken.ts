import { PREFERENCE_KEYS } from '~/utils/constants'

export function useToken() {
	const accessToken = useCookie(PREFERENCE_KEYS.ACCESS_TOKEN, {
		// httpOnly: true,
		sameSite: 'strict'
		// secure: process.env.NODE_ENV === 'production',
	})
	const refreshToken = useCookie(PREFERENCE_KEYS.REFRESH_TOKEN, {
		// httpOnly: true,
		sameSite: 'strict'
	})

	function setTokens(tokens: { accessToken: string; refreshToken: string }) {
		accessToken.value = tokens.accessToken
		refreshToken.value = tokens.refreshToken
	}

	function clearTokens() {
		accessToken.value = null
		refreshToken.value = null
	}

	return {
		accessToken,
		refreshToken,
		setTokens,
		clearTokens
	}
}
