<script setup lang="ts">
import { ToolbarToggleGroup, useForwardPropsEmits } from 'radix-vue'
import type {
	ToolbarToggleGroupProps,
	ToolbarToggleGroupEmits
} from 'radix-vue'
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '~/libs/utils'

const props = defineProps<
	ToolbarToggleGroupProps & { class?: HTMLAttributes['class'] }
>()

const emits = defineEmits<ToolbarToggleGroupEmits>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
	<ToolbarToggleGroup
		:class="
			cn(`flex gap-0.5 data-[orientation=vertical]:flex-col`, props.class)
		"
		v-bind="forwarded"
	>
		<slot />
	</ToolbarToggleGroup>
</template>

<style scoped></style>
