<template>
	<div>
		<div
			:class="cn('flex items-center justify-end gap-2 pb-1', props.headerClass)"
		>
			<div class="flex-1">
				<slot as name="header-left"></slot>
			</div>
			<div
				class="flex cursor-pointer items-center justify-between gap-1 text-sm text-muted-foreground"
				@click="handleCollapse"
			>
				{{ isOpen ? 'Hide filters' : 'Show filters' }}

				<ChevronDown
					:class="[
						'h-4 w-4 shrink-0 transition-transform duration-200',
						!isOpen ? 'rotate-180' : ''
					]"
				/>
			</div>
		</div>
		<Separator class="mb-2 mt-1" />
		<Accordion v-model="collapsible" type="single" class="w-full" collapsible>
			<AccordionItem :value="collapsibleValue" class="border-none">
				<AccordionContent class="pb-0">
					<slot></slot>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	</div>
</template>

<script setup lang="ts">
import {
	Accordion,
	AccordionContent,
	AccordionItem
} from '@/components/ui/accordion'
import { ChevronDown } from 'lucide-vue-next'
import type { HTMLAttributes } from 'vue'
import Separator from '~/components/ui/separator/Separator.vue'
import { cn } from '@/libs/utils'

interface Props {
	headerClass?: HTMLAttributes['class']
	open?: boolean
	defaultOpen?: boolean
}
const props = defineProps<Props>()
const emits = defineEmits<{
	'update:open': [open: boolean]
}>()

const collapsibleValue = 'open'

const collapsible = ref<string | undefined>(
	props.open || props.defaultOpen ? collapsibleValue : undefined
)
const isOpen = computed(() => {
	return collapsible.value === collapsibleValue
})

const handleCollapse = () => {
	collapsible.value = isOpen.value ? undefined : collapsibleValue
	emits('update:open', !isOpen.value)
}

watch(
	() => props.open,
	(newValue) => {
		if (newValue) {
			collapsible.value = collapsibleValue
		} else {
			collapsible.value = undefined
		}
	}
)
</script>

<style scoped></style>
