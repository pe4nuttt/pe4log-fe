export interface ICommentReactionsResponse {
	likesCount: number
	dislikesCount: number
	userLikeStatus: {
		isLiked: boolean
		isDisliked: boolean
	}
}
