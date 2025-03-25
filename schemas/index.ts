import { z } from 'zod'

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
	color: z.string().nullable()
})

export const EditPostSchema = z.object({
	title: z.string().nonempty('Post title is required').min(3).max(512),
	status: z.string().nonempty('Status is required'),
	// slug: z.string().nonempty('Post slug is required').max(512).optional(),
	seoTitle: z.string().max(512).optional().nullable(),
	seoDescription: z.string().max(512).optional().nullable(),
	category: z.number().min(1).optional().nullable(),
	tags: z.array(z.number().min(1)).optional().nullable()
})
