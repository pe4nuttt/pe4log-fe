<script setup lang="ts">
import { cn } from '@/libs/utils'
import {
	ScrollAreaCorner,
	ScrollAreaRoot,
	type ScrollAreaRootProps,
	ScrollAreaViewport
} from 'reka-ui'
import { computed, type HTMLAttributes } from 'vue'
import ScrollBar from './ScrollBar.vue'

const props = defineProps<
	ScrollAreaRootProps & { class?: HTMLAttributes['class'] }
>()

const delegatedProps = computed(() => {
	const { class: _, ...delegated } = props

	return delegated
})
</script>

<template>
	<ScrollAreaRoot
		v-bind="delegatedProps"
		:class="cn('relative overflow-hidden', props.class)"
	>
		<ScrollAreaViewport class="h-full w-full rounded-[inherit] px-4 sm:px-6">
			<slot />
		</ScrollAreaViewport>
		<ScrollBar />
		<ScrollAreaCorner />
	</ScrollAreaRoot>
</template>
