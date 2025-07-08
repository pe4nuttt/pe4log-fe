import type {
	IApiReponse,
	IPaginationRes,
	IBodyLogin,
	IParamsGetListUsers,
	IUser,
	IBodyAddUser,
	IResponseUploadProfilePicture
} from '~/types'
import HttpFactory from '../factory'

class UserModule extends HttpFactory {
	private readonly RESOURCE = '/users'

	async getCurrentUser() {
		return await this.call<IApiReponse<IUser>>('GET', `/auth/me`)
	}

	async getListUsers(params: IParamsGetListUsers) {
		return this.call<IApiReponse<IPaginationRes<IUser>>>(
			'GET',
			`${this.RESOURCE}`,
			undefined,
			{
				params
			}
		)
	}

	async addUser(body: IBodyAddUser) {
		return this.call<IApiReponse<IUser>>('POST', `${this.RESOURCE}`, body)
	}

	async editUser(userId: number, body: IBodyAddUser) {
		return this.call<IApiReponse<IUser>>(
			'PATCH',
			`${this.RESOURCE}/${userId}`,
			body
		)
	}

	async deleteUser(id: number) {
		return this.call<IApiReponse<void>>('DELETE', `${this.RESOURCE}/${id}`)
	}

	async uploadProfilePicture(userId: number, file: File) {
		const formData = new FormData()
		formData.append('file', file)

		return this.call<IApiReponse<IResponseUploadProfilePicture>>(
			'POST',
			`${this.RESOURCE}/${userId}/profile-image`,
			formData
		)
	}
}

export default UserModule
