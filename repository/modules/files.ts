import type {
	IApiReponse,
	IBodyUploadBlogImage,
	IResponseUploadBlogImage
} from '~/types'
import HttpFactory from '../factory'

class FilesModule extends HttpFactory {
	private readonly RESOURCE = '/files'

	async uploadBlogImage(postId: number | string, body: IBodyUploadBlogImage) {
		const formData = new FormData()
		formData.append('file', body.file)

		return this.call<IApiReponse<IResponseUploadBlogImage>>(
			'POST',
			`${this.RESOURCE}/blog-images/${postId}`,
			formData
		)
	}
}

export default FilesModule
