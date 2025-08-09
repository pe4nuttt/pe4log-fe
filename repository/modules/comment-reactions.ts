import type { IApiReponse, ICommentReactionsResponse } from '~/types'
import HttpFactory from '../factory'

class CommentReactionsModule extends HttpFactory {
	private readonly RESOURCE = '/comment-reactions'

	async likeComment(commentId: number) {
		return this.call<IApiReponse<ICommentReactionsResponse>>(
			'POST',
			`${this.RESOURCE}/${commentId}/like`,
			undefined
		)
	}

	async dislikeComment(commentId: number) {
		return this.call<IApiReponse<ICommentReactionsResponse>>(
			'POST',
			`${this.RESOURCE}/${commentId}/dislike`,
			undefined
		)
	}
}

export default CommentReactionsModule
