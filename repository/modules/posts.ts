import type {
	IApiReponse,
	IPaginationRes,
	IPost,
	IParamsGetListPosts
} from '~/types'
import HttpFactory from '../factory'

class PostsModule extends HttpFactory {
	private readonly RESOURCE = '/posts'

	async getPostDetails(id: IPost['id']) {
		return this.call<IApiReponse<IPost>>('GET', `${this.RESOURCE}/${id}`)
	}

	async getListPosts(params: IParamsGetListPosts) {
		return this.call<IApiReponse<IPaginationRes<IPost>>>(
			'GET',
			`${this.RESOURCE}`,
			undefined,
			{
				params
			}
		)
	}
}

export default PostsModule
