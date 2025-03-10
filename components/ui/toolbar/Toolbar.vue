<script setup lang="ts">
import { ToolbarRoot, useForwardProps } from 'radix-vue'
import type { ToolbarRootProps } from 'radix-vue'
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '~/libs/utils'

const props = defineProps<
	ToolbarRootProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
	<ToolbarRoot
		:class="
			cn(
				'flex !min-w-max gap-0.5 rounded-md border bg-popover p-1',
				props.class
			)
		"
		v-bind="forwardedProps"
	>
		<slot />
	</ToolbarRoot>
</template>

<style scoped></style>
