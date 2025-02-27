import { z } from 'zod'

export const LoginFormSchema = z.object({
	email: z.string().nonempty('Email is requried').email().min(2).max(50),
	password: z.string().nonempty('Password is required').min(2).max(20)
})
