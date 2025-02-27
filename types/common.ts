export interface IApiReponse<T> {
	success: boolean
	code: number
	data: T
}

export interface IApiError {
	message: string
	error: string
	statusCode: number
}
