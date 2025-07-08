import type { IPagination } from './common'

export enum EUserRole {
	ADMIN = 'admin',
	USER = 'user'
}

export enum EUserAuthProvider {
	EMAIL = 'email',
	GOOGLE = 'google',
	FACEBOOK = 'facebook',
	GITHUB = 'github'
}

export enum EUserStatus {
	ACTIVE = 'active',
	INACTIVE = 'inactive'
}

export interface IUser {
	id: number
	firstName: string
	lastName: string
	email: string
	password?: string | null
	authProvider: EUserAuthProvider
	authProviderId?: string | null
	role: EUserRole
	createdAt: Date
	updatedAt?: Date | null
	posts?: any[] | null
	comments?: Comment[] | null
	profilePicture?: string | null
	status: EUserStatus
}

export interface IParamsGetListUsers extends IPagination {
	status?: EUserStatus | null
	role?: EUserRole | null
}

export interface IBodyAddUser {
	firstName: string
	lastName: string
	email: string
	password?: string | null
	role: EUserRole
	status: EUserStatus
}

export interface IResponseUploadProfilePicture {
	imageUrl: string
	imageKey: string
}
