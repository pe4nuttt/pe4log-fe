import type {
	IApiReponse,
	IBodyAddCategory,
	IBodyLogin,
	ICategory,
	IPaginationRes,
	IParamsGetListCategories,
	IUser
} from '~/types'
import HttpFactory from '../factory'

class CategoriesModule extends HttpFactory {
	private readonly RESOURCE = '/categories'

	async getListCategories(params: IParamsGetListCategories) {
		return this.call<IApiReponse<IPaginationRes<ICategory>>>(
			'GET',
			`${this.RESOURCE}`,
			undefined,
			{
				params
			}
		)
	}

	async addCategory(body: IBodyAddCategory) {
		return this.call<IApiReponse<ICategory>>('POST', `${this.RESOURCE}`, body)
	}

	async updateCategory(categoryId: number, body: IBodyAddCategory) {
		return this.call<IApiReponse<ICategory>>(
			'PATCH',
			`${this.RESOURCE}/${categoryId}`,
			body
		)
	}

	async deleteCategory(categoryId: number) {
		return this.call<IApiReponse<void>>(
			'DELETE',
			`${this.RESOURCE}/${categoryId}`
		)
	}
}

export default CategoriesModule
