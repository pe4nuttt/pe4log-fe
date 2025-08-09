import type { IApiReponse } from '~/types'
import HttpFactory from '../factory'
import type {
	IAddCommentPayload,
	IComment,
	ICommentTreeNode
} from '~/types/comments'

class CommentsModule extends HttpFactory {
	private readonly RESOURCE = '/comments'

	async getCommentTree(slug: string) {
		return this.call<IApiReponse<ICommentTreeNode[]>>(
			'GET',
			`${this.RESOURCE}/${slug}/tree`,
			undefined
		)
	}

	async addComment(payload: IAddCommentPayload) {
		return this.call<IApiReponse<IComment>>('POST', `${this.RESOURCE}`, payload)
	}
}

export default CommentsModule
