/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { IPagination } from './common'

export interface IParamsGetListCategories extends IPagination {}

export interface ICategory {
	id: number
	name: string
	slug: string
	createdAt: string
	updatedAt: string
	deletedAt?: string | null
}

export interface IBodyAddCategory {
	name: string
	slug?: string | null
}
