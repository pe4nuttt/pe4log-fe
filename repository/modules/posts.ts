import type {
	IApiReponse,
	IBodyAddTag,
	ITag,
	IPaginationRes,
	IParamsGetListTags,
	IPost
} from '~/types'
import HttpFactory from '../factory'

class PostsModule extends HttpFactory {
	private readonly RESOURCE = '/posts'

	async getPostDetails(id: IPost['id']) {
		return this.call<IApiReponse<IPost>>('GET', `${this.RESOURCE}/${id}`)
	}
}

export default PostsModule
