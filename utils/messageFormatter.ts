import type { IApiError } from '~/types'

export function getErrorMessage(error: unknown): string {
	if (typeof error === 'string') return error

	if (error instanceof Error) return error.message

	if (error && typeof error === 'object') {
		const apiError = error as { data?: IApiError; message?: string }

		if (apiError?.data?.message) return apiError.data.message
		if (apiError?.message) return apiError.message
	}

	return 'Something went wrong'
}
