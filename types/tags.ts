/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { IPagination } from './common'

export interface IParamsGetListTags extends IPagination {}

export interface ITag {
	id: number
	name: string
	slug: string
	color?: string
	createdAt: string
	updatedAt: string
	deletedAt?: string | null
}

export interface IBodyAddTag {
	name: string
	slug?: string | null
	color?: string | null
}

export interface ITopTagResponse {
	id: number
	name: string
	slug: string
	postCount: number
}
