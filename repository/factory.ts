import type { $Fetch, FetchOptions } from 'ofetch'

type apiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

class HttpFactory {
	private $fetch: $Fetch

	constructor(fetcher: $Fetch) {
		this.$fetch = fetcher
	}

	async call<T>(
		method: apiMethod,
		url: string,
		data?: object,
		options?: FetchOptions<'json'>
	): Promise<T> {
		const $res: T = await this.$fetch<T>(url, {
			method,
			body: data,
			...options
		})
		return $res
	}
}

export default HttpFactory
