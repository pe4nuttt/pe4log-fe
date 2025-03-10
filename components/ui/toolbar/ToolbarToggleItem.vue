<script setup lang="ts">
import { ToolbarToggleItem, useForwardProps } from 'radix-vue'
import type { ToolbarToggleItemProps } from 'radix-vue'
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '~/libs/utils'

const props = defineProps<
	ToolbarToggleItemProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<ToolbarToggleItem
		:class="
			cn(
				`hover: inline-flex h-[25px] flex-shrink-0 flex-grow-0 basis-auto cursor-default select-none items-center justify-center rounded-sm px-[5px] text-sm font-medium outline-none hover:cursor-pointer hover:bg-accent hover:text-accent-foreground hover:opacity-70 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground data-[state=on]:opacity-100`,
				props.class
			)
		"
		v-bind="forwardedProps"
	>
		<slot />
	</ToolbarToggleItem>
</template>

<style scoped></style>
