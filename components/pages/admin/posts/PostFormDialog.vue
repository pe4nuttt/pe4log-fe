<template>
	<Sheet v-model:open="open">
		<SheetContent class="flex flex-col">
			<LoadingOverlay v-if="isLoading" />
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
					<div>
						<UploadImage
							:image-url="post?.coverImage"
							:loading="isUploadingPostCover"
							class="w-full"
							@change="onChangeCover"
						/>
					</div>
					<FormItem>
						<FormLabel class="required">Title</FormLabel>
						<FormControl>
							<Input type="text" placeholder="Title" v-bind="componentField" />
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<div>
					<Label for="slug">Slug</Label>
					<Input
						id="slug"
						type="text"
						placeholder="Slug"
						:model-value="post?.slug"
						readonly
					/>
				</div>
				<FormField v-slot="{ componentField }" name="category">
					<FormItem>
						<FormLabel class="required">Category</FormLabel>
						<FormControl>
							<Select v-bind="componentField">
								<SelectTrigger id="category" name="category">
									<SelectValue placeholder="Select a category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem
										v-for="item in listCategoryOptions"
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
				<FormField v-slot="{ componentField }" name="tags">
					<FormItem>
						<FormLabel class="">Tags</FormLabel>
						<FormControl>
							<MultiSelect
								v-bind="componentField"
								id="tags"
								:options="listTagOptions"
								type="text"
								placeholder="Select tags"
								class="min-h-8"
							/>
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
				<FormField
					v-if="formData.status === EPostStatus.PUBLISHED"
					v-slot="{ componentField }"
					name="publishedAt"
				>
					<FormItem>
						<FormLabel class="required">Published at</FormLabel>
						<FormControl>
							<CalendarInput
								v-bind="componentField"
								mode="dateTime"
								:model-value="componentField.modelValue"
								@update:model-value="componentField['onUpdate:modelValue']"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				</FormField>
				<FormField v-slot="{ componentField }" name="description">
					<FormItem>
						<FormLabel class="required">Post description</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Post description"
								v-bind="componentField"
							/>
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
				<Button
					type="submit"
					:disabled="isSubmitting || !meta.dirty"
					@click="onSubmit"
				>
					<Loader v-if="isSubmitting" />
					Save changes
				</Button>
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
import Label from '~/components/ui/label/Label.vue'
import Loader from '~/components/global/Loader.vue'
import LoadingOverlay from '~/components/global/LoadingOverlay.vue'
import { CalendarInput } from '~/components/ui/calendar-select'

const props = withDefaults(
	defineProps<{
		open?: boolean
		category?: ICategory | null
	}>(),
	{}
)

const emits = defineEmits<{
	'update:open': [open: boolean]
	updated: []
}>()

const { $api } = useNuxtApp()
const { toastSuccess, toastError } = useAppToast()
const dayjs = useDayjs()

// State + refs
const open = useVModel(props, 'open', emits) as Ref<boolean>
const formSchema = toTypedSchema(EditPostSchema)
const postStore = usePostStore()
const { post } = storeToRefs(postStore)
const {
	meta,
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
const postCoverFile = ref<File | null>()
const isUploadingPostCover = ref(false)
const { data: listTags, status: getListTagsStatus } = await useAsyncData(() =>
	$api.tags.getListTags({
		all: true
	})
)
const { data: listCategories, status: getListCategoriesStatus } =
	await useAsyncData(() =>
		$api.categories.getListCategories({
			all: true
		})
	)

// Options
const listCategoryOptions = computed(() => {
	return (
		listCategories.value?.data?.items.map((category) => ({
			label: category.name,
			value: category.id
		})) ?? []
	)
})
const listTagOptions = computed(() => {
	return (
		listTags.value?.data?.items.map((tag) => ({
			label: tag.name,
			value: tag.id
		})) ?? []
	)
})
const postStatusOptions = [
	{
		label: 'Draft',
		value: EPostStatus.DRAFT
	},
	{
		label: 'Published',
		value: EPostStatus.PUBLISHED
	},
	{
		label: 'Archived',
		value: EPostStatus.ARCHIVED
	}
]

const isLoading = computed(
	() =>
		getListTagsStatus.value === 'pending' ||
		getListCategoriesStatus.value === 'pending'
)

watch(
	() => formData.title,
	(value) => {
		// if (value) setFieldValue('slug', generateSlug(value))
	}
)

watch(
	() => [open.value, post.value],
	() => {
		console.log('[CHECK]', open.value, post.value)
		if (!open.value) {
			resetForm()
		} else {
			resetForm({
				values: {
					title: post.value?.title ?? '',
					category: post.value?.category?.id ?? null,
					tags: post.value?.tags?.map((tag) => tag.id) ?? [],
					seoDescription: post.value?.seoDescription ?? null,
					seoTitle: post.value?.seoTitle ?? null,
					status: post.value?.status ?? EPostStatus.DRAFT,
					publishedAt: post.value?.publishedAt
						? dayjs(post.value.publishedAt).toDate()
						: null,
					description: post.value?.description ?? ''
				}
			})
		}
	}
)

// Methods
const onChangeCover = async (file: File | null) => {
	postCoverFile.value = file

	if (!post.value || !file) return

	try {
		isUploadingPostCover.value = true
		const res = await $api.posts.uploadPostCoverImage(post.value.id, file)
		toastSuccess(res.message)
		post.value.coverImage = res.data.imageUrl
	} catch (error) {
		toastError(error)
	} finally {
		isUploadingPostCover.value = false
	}
}

const onSubmit = handleSubmit(async (values) => {
	console.log('SUBMIT', values)
	try {
		const res = await $api.posts.editPost(post.value!.id, {
			...values,
			status: values.status as EPostStatus,
			categoryId: values.category,
			tagIds: values.tags,
			publishedAt:
				values.status === EPostStatus.PUBLISHED
					? dayjs(values.publishedAt).format('YYYY-MM-DD HH:mm:ss')
					: null
		})
		toastSuccess(res.message)
		emits('updated')
	} catch (error) {
		toastError(error)
	}
})
</script>

<style scoped></style>
