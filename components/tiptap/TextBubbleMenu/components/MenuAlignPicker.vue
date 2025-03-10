<template>
	<DropdownMenu>
		<DropdownMenuTrigger>
			<ToolbarButton>
				<div
					class="mr-1 h-[15px] w-[15px] rounded-full bg-foreground"
					:style="{
						background: highlightColor || color
					}"
				></div>
				<!-- <span class="mr-1">
          {{ activeItem?.type === 'option' ? activeItem.label : 'Paragraph' }}
        </span> -->
				<Icon name="lucide:chevron-down" />
			</ToolbarButton>
		</DropdownMenuTrigger>
		<DropdownMenuContent class="min-w-48 p-0">
			<ScrollArea :class="cn(`h-[400px] w-full pl-1 pr-3`)">
				<DropdownMenuGroup>
					<DropdownMenuLabel class="text-[10px] uppercase">
						Color
					</DropdownMenuLabel>
					<DropdownMenuItem
						v-for="item in EDITOR_TEXT_COLORS"
						@click="() => onChangeColor(item.color)"
						:key="`foreground-${item.color}`"
					>
						<div
							:style="{
								color: item.color
							}"
							class="mr-2 rounded-[2px] border-[1px] border-muted px-[3px] font-medium leading-4"
						>
							A
						</div>
						<span>{{ item.label }}</span>
					</DropdownMenuItem>
					<DropdownMenuLabel class="mt-2 text-[10px] uppercase">
						Highlight
					</DropdownMenuLabel>
					<DropdownMenuItem
						v-for="item in EDITOR_HIGHTLIGHT_COLORS"
						:key="`highlight-${item.color}`"
						@click="() => onChangeHighlightColor(item.color)"
					>
						<div
							:style="{
								background: item.color
							}"
							class="mr-2 rounded-[2px] border-[1px] border-muted px-[3px] font-medium leading-4"
						>
							A
						</div>
						<span>{{ item.label }}</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</ScrollArea>
		</DropdownMenuContent>
	</DropdownMenu>
</template>

<script setup lang="ts">
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ToolbarButton } from '~/components/ui/toolbar'
import { EDITOR_HIGHTLIGHT_COLORS, EDITOR_TEXT_COLORS } from '~/utils/constants'
import { cn } from '~/libs/utils'
import { ScrollArea } from '~/components/ui/scroll-area'
import { divide } from 'lodash'

export type MenuAlignPickerProps = {
	align: string
	// onChangeColor: (color: string) => void;
	// onClearColor: () => void;
	// onChangeHighlightColor: (color: string) => void;
	// onClearHighlightColor: () => void;
}

// Props
const props = defineProps<MenuAlignPickerProps>()

const emits = defineEmits<{
	changeColor: [color: string]
	changeHighlightColor: [color: string]
	clearColor: []
	clearHighlightColor: []
}>()

const { color, highlightColor } = toRefs(props)

// const {
//   onChangeColor,
//   onChangeHighlightColor,
//   onClearColor,
//   onClearHighlightColor,
// } = props;

// Methods
const onChangeColor = (color: string) => {
	emits('changeColor', color)
}

const onChangeHighlightColor = (color: string) => {
	emits('changeHighlightColor', color)
}

const onClearColor = () => {
	emits('clearColor')
}

const onClearHighlightColor = () => {
	emits('clearHighlightColor')
}

onMounted(() => {})
</script>

<style scoped></style>
