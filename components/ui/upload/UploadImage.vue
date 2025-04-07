<template>
	<div class="relative h-40 w-40" v-bind="$attrs">
		<NuxtImg
			class="h-full w-full cursor-pointer overflow-hidden rounded-sm bg-secondary object-contain"
			:src="imageUrl ?? blankImage"
			@click="onClickImage"
		/>
		<Input
			ref="inputRef"
			class="h-0 w-0 border-none p-0 opacity-0"
			type="file"
			accept="image/*"
			@change="onUploadImage"
		/>
		<LoadingOverlay v-if="loading" class="top-0" />
	</div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import blankImage from '@/assets/images/blank_image.svg'
import LoadingOverlay from '~/components/global/LoadingOverlay.vue'
import { useVModel } from '@vueuse/core'

interface Props {
	imageUrl?: string | null
	loading?: boolean | null
}

const props = withDefaults(defineProps<Props>(), {
	imageUrl: null
})

const emits = defineEmits<{
	'update:imageUrl': [imageUrl: string | null]
	change: [file: File | null]
}>()

const imageUrl = useVModel(props, 'imageUrl', emits)
const inputRef = ref()

const onUploadImage = (e: any) => {
	imageUrl.value = URL.createObjectURL(e.target.files[0])
	emits('change', e.target.files[0])
}

const onClickImage = () => {
	inputRef?.value?.$el?.click()
}
</script>

<style scoped></style>
