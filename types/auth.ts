import type { IUser } from './user'

export interface IBodyLogin {
	email: string
	password: string
}

export interface ILoginResponse {
	accessToken: string
	refreshToken: string
	tokenExpires: number
	user: IUser
}

export interface IRefreshTokensResponse {
	accessToken: string
	refreshToken: string
	tokenExpires: number
}
