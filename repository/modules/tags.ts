import type {
	IApiReponse,
	IBodyAddTag,
	ITag,
	IPaginationRes,
	IParamsGetListTags,
	ITopTagResponse
} from '~/types'
import HttpFactory from '../factory'

class TagsModule extends HttpFactory {
	private readonly RESOURCE = '/tags'

	async getListTags(params: IParamsGetListTags) {
		return this.call<IApiReponse<IPaginationRes<ITag>>>(
			'GET',
			`${this.RESOURCE}`,
			undefined,
			{
				params
			}
		)
	}

	async addTag(body: IBodyAddTag) {
		return this.call<IApiReponse<ITag>>('POST', `${this.RESOURCE}`, body)
	}

	async updateTag(tagId: number, body: IBodyAddTag) {
		return this.call<IApiReponse<ITag>>(
			'PATCH',
			`${this.RESOURCE}/${tagId}`,
			body
		)
	}

	async deleteTag(tagId: number) {
		return this.call<IApiReponse<void>>('DELETE', `${this.RESOURCE}/${tagId}`)
	}

	async getTopTags(limit: number = 6) {
		return this.call<IApiReponse<ITopTagResponse[]>>(
			'GET',
			`${this.RESOURCE}/top`,
			undefined,
			{
				params: { limit }
			}
		)
	}
}

export default TagsModule
