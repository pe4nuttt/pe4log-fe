import type { IPost } from './posts'
import type { IUser } from './user'

export interface IComment {
	id: number
	content: string
	user: IUser
	post: IPost
	path: string
	depth: number
	createdAt: Date | string
	updatedAt?: Date | string | null
	deletedAt?: Date | string | null
}

export interface ICommentTreeNode extends IComment {
	children?: ICommentTreeNode[] | null
	isLiked?: boolean
	isDisliked?: boolean
	likesCount: number
	dislikesCount: number
}

export interface IAddCommentPayload {
	postSlug: string
	content: string
	parentId?: number | null
}
