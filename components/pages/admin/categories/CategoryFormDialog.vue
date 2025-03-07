<template>
	<Sheet v-model:open="open">
		<SheetContent class="flex flex-col">
			<SheetHeader>
				<SheetTitle>
					{{ type === EEntityFormType.ADD ? 'Add Category' : 'Edit Category' }}
				</SheetTitle>
				<SheetDescription>
					{{
						type === EEntityFormType.ADD
							? 'Add a new category'
							: 'Edit category'
					}}
					by providing necessary info. Click save when you're done.
				</SheetDescription>
			</SheetHeader>
			<form class="flex-1 space-y-5">
				<FormField
					v-slot="{ componentField }"
					name="name"
					:validate-on-blur="!isFieldDirty"
				>
					<FormItem>
						<FormLabel>Name</FormLabel>
						<FormControl>
							<Input type="text" placeholder="Name" v-bind="componentField" />
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
			</form>
			<SheetFooter>
				<SheetClose as-child>
					<Button variant="outline" type="submit">Close</Button>
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
import { toTypedSchema } from '@vee-validate/zod'
import { useVModel } from '@vueuse/core'
import { useForm } from 'vee-validate'
import type { z } from 'zod'
import { AddCategorySchema } from '~/schemas'
import { EEntityFormType, type IBodyAddCategory, type ICategory } from '~/types'
import slugify from 'slugify'

const props = withDefaults(
	defineProps<{
		open?: boolean
		category?: ICategory | null
		type: EEntityFormType
	}>(),
	{
		type: EEntityFormType.ADD
	}
)

const emits = defineEmits<{
	'update:open': [open: boolean]
	saveSuccess: []
}>()

const { $api } = useNuxtApp()
const { toastSuccess, toastError } = useAppToast()

const open = useVModel(props, 'open', emits) as Ref<boolean>

const formSchema = toTypedSchema(AddCategorySchema)

const {
	values: formData,
	errors,
	isSubmitting,
	handleSubmit,
	setFieldValue,
	setValues,
	isFieldDirty,
	resetForm
} = useForm<z.infer<typeof AddCategorySchema>>({
	validationSchema: formSchema,
	initialValues: {
		name: '',
		slug: undefined
	}
})

watch(
	() => formData.name,
	(value) => {
		if (value) setFieldValue('slug', generateSlug(value))
	}
)

watch(
	[props.type, () => props.category],
	() => {
		if (props.type === EEntityFormType.EDIT && props.category) {
			setValues({
				name: props.category.name,
				slug: props.category.slug
			})
		}
	},
	{
		deep: true
	}
)

watch(open, (value) => {
	if (!value) {
		resetForm()
	}
})

const onSubmit = handleSubmit(async (values) => {
	try {
		let res
		if (props.type === EEntityFormType.ADD) {
			res = await $api.categories.addCategory(values)
		} else if (props.category) {
			res = await $api.categories.updateCategory(props.category.id, values)
		}

		if (res) {
			toastSuccess(res.message)
			emits('saveSuccess')
		}
	} catch (error) {
		toastError(error)
	}
})
</script>

<style scoped></style>
