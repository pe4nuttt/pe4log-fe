<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/libs/utils'
import { useVModel } from '@vueuse/core'

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes['class']
		defaultValue?: string | number
		modelValue?: string | number
		autoHeight?: boolean
	}>(),
	{
		autoHeight: true
	}
)

const emits = defineEmits<{
	(e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
	passive: true,
	defaultValue: props.defaultValue
})

const textareaRef = ref(null)

const autoResize = () => {
	if (!textareaRef.value || !props.autoHeight) return
	const textarea = textareaRef.value as HTMLElement

	const computedStyle = window?.getComputedStyle(textarea)
	const borderWidth = computedStyle.borderWidth
		? parseFloat(computedStyle.borderWidth)
		: 0

	textarea.style.height = 'auto' // Reset height
	textarea.style.height = `${textarea.scrollHeight + borderWidth * 2}px` // Expand only when needed
}

onMounted(() => {
	nextTick(autoResize)
})
</script>

<template>
	<textarea
		ref="textareaRef"
		v-model="modelValue"
		:class="
			cn(
				'flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
				props.class
			)
		"
		@input="autoResize"
	/>
</template>

<style scoped lang="scss"></style>
