<script setup lang="ts">
import { ToolbarButton, useForwardProps } from 'radix-vue'
import type { ToolbarButtonProps } from 'radix-vue'
import { type HTMLAttributes, computed } from 'vue'
import { cn } from '~/libs/utils'
import Button, { type ButtonProps } from '../button/Button.vue'

const props = withDefaults(
	defineProps<
		ButtonProps & {
			active?: boolean
		}
	>(),
	{
		variant: 'ghost'
	}
)

// const delegatedProps = computed(() => {
//   const { class: _, ...delegated } = props;

//   return delegated;
// });

const forwardedProps = useForwardProps(props)
</script>

<template>
	<!-- <ToolbarButton :class="cn('', props.class)" v-bind="forwardedProps">
    <slot />
  </ToolbarButton> -->
	<Button
		:class="
			cn(
				'h-[28px] min-w-[28px] rounded-sm px-[5px] hover:opacity-70',
				props.active && 'bg-accent text-accent-foreground opacity-100'
			)
		"
		v-bind="forwardedProps"
	>
		<slot />
	</Button>
</template>

<style scoped></style>
