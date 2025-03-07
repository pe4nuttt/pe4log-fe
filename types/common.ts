export enum EOrder {
	DESC = 'desc',
	ASC = 'asc'
}
export interface IApiReponse<T> {
	success: boolean
	code: number
	data: T
	message: string
}

export interface IApiError {
	message: string
	error: string
	statusCode: number
}

export interface IPagination {
	page?: number | null
	limit?: number | null
	sortBy?: string | null
	order?: EOrder | null
	search?: string | null
	all?: boolean | null
}

export interface IPaginationRes<T> {
	page: number
	limit: number
	totalPages: number
	totalCount: number
	items: T[]
}

export interface ITableSortChangeData {
	sortBy?: string | null
	order?: EOrder | null
}

export enum EEntityFormType {
	ADD = 'add',
	EDIT = 'edit'
}
