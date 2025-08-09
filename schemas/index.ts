import { z } from 'zod'
import { EPostStatus } from '~/types'

export const LoginFormSchema = z.object({
	email: z.string().nonempty('Email is requried').email().min(2).max(50),
	password: z.string().nonempty('Password is required').min(2).max(20)
})

export const AddCategorySchema = z.object({
	name: z.string().nonempty('Name is requried').min(3).max(50),
	slug: z.string().min(3).max(200).optional().nullable().or(z.literal(''))
})

export const AddTagSchema = z.object({
	name: z.string().nonempty('Name is requried').min(3).max(50),
	slug: z.string().min(3).max(200).optional().nullable().or(z.literal('')),
	color: z.string().nullable().optional()
})

export const EditPostSchema = z
	.object({
		title: z.string().nonempty('Post title is required').min(3).max(512),
		description: z
			.string()
			.nonempty('Post description is required')
			.min(3)
			.max(1000),
		status: z.string().nonempty('Status is required'),
		// slug: z.string().nonempty('Post slug is required').max(512).optional(),
		seoTitle: z.string().max(512).optional().nullable(),
		seoDescription: z.string().max(512).optional().nullable(),
		category: z.number().min(1).optional().nullable(),
		tags: z.array(z.number().min(1)).optional().nullable(),
		publishedAt: z.date().optional().nullable()
	})
	.refine(
		(data) => {
			if (data.status === EPostStatus.PUBLISHED && !data.publishedAt) {
				return false
			}

			return true
		},
		{
			message: 'Published at is required',
			path: ['publishedAt']
		}
	)

export const AddUserSchema = z
	.object({
		firstName: z.string().nonempty('First name is required').min(2).max(50),
		lastName: z.string().nonempty('Last name is required').min(2).max(50),
		email: z.string().nonempty('Email is required').email().min(2).max(50),
		username: z.string().nonempty('Username is required').min(2).max(250),
		password: z.string().min(6).max(20).optional().nullable(),
		confirmPassword: z.string().min(6).max(20).optional().nullable(),
		role: z.string().nonempty('Role is required'),
		status: z.string().nonempty('Status is required'),
		profilePicture: z.string().optional().nullable()
	})
	.refine((data) => data.password == data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	})
