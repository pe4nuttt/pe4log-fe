import type { IApiReponse, IBodyLogin, IUser } from '~/types'
import HttpFactory from '../factory'

class UserModule extends HttpFactory {
	private readonly RESOURCE = '/user'

	async getCurrentUser() {
		return await this.call<IApiReponse<IUser>>('GET', `/auth/me`)
	}
}

export default UserModule
