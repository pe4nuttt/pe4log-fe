<template>
	<AlertDialog v-model:open="open">
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>
					Delete this category: {{ category?.name }}?
				</AlertDialogTitle>
				<AlertDialogDescription>
					This action cannot be undone. This will permanently delete your
					category and remove your data from our servers.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel>Cancel</AlertDialogCancel>
				<Button type="submit" variant="destructive" @click="handleDelete">
					Delete
				</Button>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>

<script setup lang="ts">
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'
import type { ICategory } from '~/types'
import { useVModel } from '@vueuse/core'

const props = withDefaults(
	defineProps<{
		open?: boolean
		category?: ICategory | null
	}>(),
	{}
)

const emits = defineEmits<{
	'update:open': [open: boolean]
	deleteSuccess: []
}>()

const { $api } = useNuxtApp()
const { toastSuccess, toastError } = useAppToast()

const open = useVModel(props, 'open', emits) as Ref<boolean>

const handleDelete = async () => {
	if (!props.category) return

	try {
		const res = await $api.categories.deleteCategory(props.category.id)
		emits('deleteSuccess')
		toastSuccess(res.message)
	} catch (error) {
		toastError(error)
	}
}
</script>

<style scoped></style>
