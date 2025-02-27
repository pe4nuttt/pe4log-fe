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

export interface IUser {
	id: string
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
}
