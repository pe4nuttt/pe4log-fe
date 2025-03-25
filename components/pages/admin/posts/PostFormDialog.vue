<template>
	<Sheet v-model:open="open">
		<SheetContent class="flex flex-col">
			<SheetHeader>
				<SheetTitle>Post</SheetTitle>
				<SheetDescription>
					Edit post by providing necessary info. Click save when you're done.
				</SheetDescription>
			</SheetHeader>
			<form
				class="mb-4 mr-[-1rem] flex-1 space-y-5 overflow-y-auto pl-[1px] pr-4"
			>
				<FormField
					v-slot="{ componentField }"
					name="title"
					:validate-on-blur="!isFieldDirty"
				>
					<FormItem>
						<FormLabel class="required">Title</FormLabel>
						<FormControl>
							<Input type="text" placeholder="Title" v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="status">
					<FormItem>
						<FormLabel class="required">Status</FormLabel>
						<FormControl>
							<Select v-bind="componentField">
								<SelectTrigger id="status" name="status">
									<SelectValue placeholder="Select a status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										v-for="item in postStatusOptions"
										:key="item.value"
										:value="item.value"
									>
										{{ item.label }}
									</SelectItem>
								</SelectContent>
							</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="slug">
					<FormItem>
						<FormLabel>Slug</FormLabel>
						<FormControl>
							<Input type="text" placeholder="Slug" v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="seoTitle">
					<FormItem>
						<FormLabel>SEO title</FormLabel>
						<FormControl>
							<Textarea placeholder="SEO title" v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="seoDescription">
					<FormItem>
						<FormLabel>SEO description</FormLabel>
						<FormControl>
							<Textarea
								rows="6"
								placeholder="SEO description"
								v-bind="componentField"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
			</form>
			<SheetFooter>
				<SheetClose as-child>
					<Button variant="outline">Close</Button>
				</SheetClose>
				<Button type="submit" @click="onSubmit">Save changes</Button>
			</SheetFooter>
		</SheetContent>
	</Sheet>
</template>

<script setup lang="ts">
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetFooter,
	SheetTrigger
} from '@/components/ui/sheet'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toTypedSchema } from '@vee-validate/zod'
import { useVModel } from '@vueuse/core'
import { useForm } from 'vee-validate'
import type { z } from 'zod'
import { EditPostSchema } from '~/schemas'
import {
	EEntityFormType,
	EPostStatus,
	type IBodyAddCategory,
	type ICategory
} from '~/types'
import slugify from 'slugify'

const props = withDefaults(
	defineProps<{
		open?: boolean
		category?: ICategory | null
	}>(),
	{}
)

const emits = defineEmits<{
	'update:open': [open: boolean]
	saveSuccess: []
}>()

const { $api } = useNuxtApp()
const { toastSuccess, toastError } = useAppToast()

const open = useVModel(props, 'open', emits) as Ref<boolean>

const formSchema = toTypedSchema(EditPostSchema)

const postStatusOptions = [
	{ value: EPostStatus.DRAFT, label: 'Draft' },
	{ value: EPostStatus.PUBLISHED, label: 'Publish' }
]

const {
	values: formData,
	errors,
	isSubmitting,
	handleSubmit,
	setFieldValue,
	setValues,
	isFieldDirty,
	resetForm
} = useForm<z.infer<typeof EditPostSchema>>({
	validationSchema: formSchema,
	initialValues: {
		title: '',
		category: undefined,
		tags: [],
		seoDescription: null,
		seoTitle: null
	}
})

watch(
	() => formData.title,
	(value) => {
		// if (value) setFieldValue('slug', generateSlug(value))
	}
)

watch(open, (value) => {
	if (!value) {
		resetForm()
	}
})

const onSubmit = handleSubmit(async (values) => {
	console.log('SUBMIT', values)
})
</script>

<style scoped></style>
