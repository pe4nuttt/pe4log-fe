<template>
	<Button
		variant="outline"
		:class="
			cn(
				'relative h-8 w-full flex-1 justify-start rounded-md bg-muted/25 text-sm font-normal text-muted-foreground shadow-none hover:bg-muted/50 sm:pr-12 md:w-40 md:flex-none lg:w-56 xl:w-64',
				props.class
			)
		"
	>
		<Search
			aria-hidden="true"
			class="absolute left-1.5 top-1/2 -translate-y-1/2"
		/>
		<span className="ml-3">{{ props.placeholder }}</span>
		<kbd
			className="pointer-events-none absolute right-[0.3rem] top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex"
		>
			<span className="text-xs">⌘</span>
			K
		</kbd>
	</Button>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import Button from '../ui/button/Button.vue'
import { Search } from 'lucide-vue-next'
import { cn } from '@/libs/utils'

interface Props {
	class?: HTMLAttributes['class']
	placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
	placeholder: 'Search'
})
</script>

<style scoped></style>
