<template>
	<AlertDialog :open="open">
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>{{ title }}</AlertDialogTitle>
				<AlertDialogDescription>
					{{ message }}
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel @click="handleReject">
					{{ rejectText }}
				</AlertDialogCancel>
				<AlertDialogAction
					as="button"
					:disabled="isResolving"
					@click="handleResolve"
				>
					<Loader v-if="isResolving" />
					{{ resolveText }}
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
</template>

<script setup lang="ts">
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog'
import Loader from './Loader.vue'

export type VxDialogProps = {
	modelValue: boolean
	type?: 'confirm' | 'alert'
	title?: string
	message?: string
	resolveText?: string
	rejectText?: string
	resolve?: () => void | Promise<void>
	reject?: () => void | Promise<void>
}

const props = withDefaults(defineProps<VxDialogProps>(), {
	modelValue: false,
	type: 'confirm',
	title: 'Confirm',
	message: 'Are you sure?',
	resolveText: 'OK',
	rejectText: 'Cancel',
	resolve: () => {},
	reject: () => {}
})

const open = ref(props.modelValue)
const isResolving = ref(false)

const handleReject = async () => {
	await new Promise((resolve) => resolve(props.reject()))
	open.value = false
}

const handleResolve = async () => {
	isResolving.value = true
	await new Promise((resolve) => resolve(props.resolve()))
	open.value = false
}
</script>

<style scoped></style>
