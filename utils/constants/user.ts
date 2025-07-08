import { EUserRole, EUserStatus } from '~/types'

export const USER_ROLE_OPTIONS = [
	{
		label: 'User',
		value: EUserRole.USER
	},
	{
		label: 'Admin',
		value: EUserRole.ADMIN
	}
]

export const USER_STATUS_OPTIONS = [
	{
		label: 'Inactive',
		value: EUserStatus.INACTIVE
	},
	{
		label: 'Active',
		value: EUserStatus.ACTIVE
	}
]
