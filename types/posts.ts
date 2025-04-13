import type { ICategory } from './categories'
import type { IPagination } from './common'
import type { ITag } from './tags'
import type { IUser } from './user'

export enum EPostStatus {
	DRAFT = 'draft',
	PUBLISHED = 'published',
	ARCHIVED = 'archived'
}

export interface IPost {
	id: number
	title?: string
	description?: string
	coverImage?: string
	slug?: string
	seoTitle?: string
	seoDescription?: string
	content?: Buffer
	status: EPostStatus
	author: IUser
	category?: ICategory
	tags: ITag[]
	// comments: Comment[]
	createdAt: Date
	updatedAt?: Date | null
	deletedAt?: Date | null
	publishedAt?: string | null
}

export interface IParamsGetListPosts extends IPagination {
	status?: EPostStatus | null
	tagIds?: number[] | null
	authorId?: number | null
	categoryId?: number | null
	createdAtFrom?: Date | string | null
	createdAtTo?: Date | string | null
	categorySlug?: string | null
	tagSlug?: string | null
}

export interface IBodyEditPost {
	title: string
	seoTitle?: string | null
	seoDescription?: string | null
	status: EPostStatus
	categoryId?: number | null
	tagIds?: number[] | null
	description: string
	publishedAt?: string | null
}

export interface IResponseUploadPostCoverImage {
	imageUrl: string
}
