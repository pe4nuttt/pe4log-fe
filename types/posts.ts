import type { IUser } from './user'

export enum EPostStatus {
	DRAFT = 'draft',
	PUBLISHED = 'published',
	ARCHIVED = 'archived'
}

export interface IPost {
	id: number
	title?: string
	slug?: string
	seoTitle?: string
	seoDescription?: string
	content?: Buffer
	status: EPostStatus
	author: IUser['id']
	category?: any
	tags: any[]
	// comments: Comment[]
	createdAt: Date
	updatedAt?: Date | null
	deletedAt?: Date | null
}
