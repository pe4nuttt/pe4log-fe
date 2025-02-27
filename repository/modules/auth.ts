import type { IApiReponse, IBodyLogin, ILoginResponse } from '~/types'
import HttpFactory from '../factory'

class AuthModule extends HttpFactory {
	private readonly RESOURCE = '/auth'

	async login(body: IBodyLogin) {
		return await this.call<IApiReponse<ILoginResponse>>(
			'POST',
			`${this.RESOURCE}/sign-in`,
			body
		)
	}
}

export default AuthModule
