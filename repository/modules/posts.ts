import type {
	IApiReponse,
	IPaginationRes,
	IPost,
	IParamsGetListPosts,
	IBodyEditPost,
	IResponseUploadPostCoverImage
} from '~/types'
import HttpFactory from '../factory'
import type { JSONContent } from 'echo-editor'

class PostsModule extends HttpFactory {
	private readonly RESOURCE = '/posts'

	async getPostDetails(id: IPost['id']) {
		return this.call<IApiReponse<IPost>>('GET', `${this.RESOURCE}/${id}`)
	}

	async getPostHtmlContent(id: IPost['id']) {
		return this.call<IApiReponse<string | null>>(
			'GET',
			`${this.RESOURCE}/${id}/html`
		)
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

	async getListPostsClient(params: IParamsGetListPosts) {
		return this.call<IApiReponse<IPaginationRes<IPost>>>(
			'GET',
			`${this.RESOURCE}/client`,
			undefined,
			{
				params
			}
		)
	}

	async generateNewPost() {
		return this.call<IApiReponse<IPost>>('POST', `${this.RESOURCE}/generate`)
	}

	async editPost(postId: number, body: IBodyEditPost) {
		return this.call<IApiReponse<IPost>>(
			'PATCH',
			`${this.RESOURCE}/${postId}`,
			body
		)
	}

	async editPostHtmlContent(postId: number, htmlContent: string) {
		return this.call<IApiReponse<string | null>>(
			'PUT',
			`${this.RESOURCE}/${postId}/html`,
			{
				htmlContent
			}
		)
	}

	async deletePost(postId: number) {
		return this.call<IApiReponse<void>>('DELETE', `${this.RESOURCE}/${postId}`)
	}

	async uploadPostCoverImage(postId: number, file: File) {
		const formData = new FormData()
		formData.append('file', file)

		return this.call<IApiReponse<IResponseUploadPostCoverImage>>(
			'POST',
			`${this.RESOURCE}/${postId}/cover-image`,
			formData
		)
	}
}

export default PostsModule
