<template>
	<Sheet v-model:open="open">
		<SheetContent class="flex flex-col">
			<SheetHeader>
				<SheetTitle>
					{{ type === EEntityFormType.ADD ? 'Add Tag' : 'Edit Tag' }}
				</SheetTitle>
				<SheetDescription>
					{{ type === EEntityFormType.ADD ? 'Add a new tag' : 'Edit tag' }}
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
				<FormField v-slot="{ componentField }" name="color">
					<FormItem>
						<FormLabel>Color</FormLabel>
						<FormControl>
							<Select v-bind="componentField">
								<SelectTrigger id="color" name="color">
									<SelectValue placeholder="Select a color">
										<div class="flex items-center gap-1">
											<div
												:style="{
													color: componentField.modelValue ?? 'inherit',
													background: componentField.modelValue
														? getTagBackgroundFromColor(
																componentField.modelValue
															)
														: 'unset'
												}"
												class="mr-2 rounded-2xl border-[1px] border-muted px-2 py-[3px] text-xs font-medium leading-4"
											>
												Tag
											</div>
											{{
												getTagLabelByColor(componentField.modelValue) ??
												'Default'
											}}
										</div>
									</SelectValue>
								</SelectTrigger>
								<SelectContent>
									<SelectItem :value="null">
										<div class="flex items-center gap-1">
											<div
												:style="{
													color: 'inherit'
												}"
												class="mr-2 rounded-2xl border-[1px] border-muted px-2 py-[3px] text-xs font-medium leading-4"
											>
												Tag
											</div>
											Default
										</div>
									</SelectItem>
									<SelectItem
										v-for="item in TAG_COLORS"
										:key="item.color"
										:value="item.color"
									>
										<div class="flex items-center gap-1">
											<div
												:style="{
													color: item.color,
													background: getTagBackgroundFromColor(item.color)
												}"
												class="mr-2 rounded-2xl border-[1px] border-muted px-2 py-[3px] text-xs font-medium leading-4"
											>
												Tag
											</div>
											{{ item.label }}
										</div>
									</SelectItem>
								</SelectContent>
							</Select>
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
import { toTypedSchema } from '@vee-validate/zod'
import { useVModel } from '@vueuse/core'
import { useForm } from 'vee-validate'
import type { z } from 'zod'
import { AddTagSchema } from '~/schemas'
import { EEntityFormType, type ITag } from '~/types'
import { TAG_COLORS } from '~/utils/constants'
import { getTagLabelByColor, getTagBackgroundFromColor } from '~/utils/color'

const props = withDefaults(
	defineProps<{
		open?: boolean
		tag?: ITag | null
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

const formSchema = toTypedSchema(AddTagSchema)

const {
	values: formData,
	errors,
	isSubmitting,
	handleSubmit,
	setFieldValue,
	setValues,
	isFieldDirty,
	resetForm
} = useForm<z.infer<typeof AddTagSchema>>({
	validationSchema: formSchema,
	initialValues: {
		name: '',
		slug: undefined,
		color: null
	}
})

watch(
	() => formData.name,
	(value) => {
		if (value) setFieldValue('slug', generateSlug(value))
	}
)

watch(
	[open, props.type, () => props.tag],
	() => {
		if (open && props.type === EEntityFormType.EDIT && props.tag) {
			setValues({
				name: props.tag.name,
				slug: props.tag.slug,
				color: props.tag.color
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
			res = await $api.tags.addTag(values)
		} else if (props.tag) {
			res = await $api.tags.updateTag(props.tag.id, values)
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
