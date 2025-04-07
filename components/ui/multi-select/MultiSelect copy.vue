<template>
	<Popover v-model:open="isPopoverOpen" :modal="modalPopover">
		<PopoverTrigger as-child>
			<Button
				:class="
					cn(
						'flex h-auto min-h-10 w-full items-center justify-between rounded-md border bg-inherit p-1 hover:bg-inherit [&_svg]:pointer-events-auto',
						className
					)
				"
				@click="togglePopover"
			>
				<template v-if="selectedValues.length">
					<div class="flex w-full items-center justify-between">
						<div class="flex flex-wrap items-center">
							<template
								v-for="value in selectedValues.slice(0, maxCount)"
								:key="value"
							>
								<Badge
									:class="
										cn(
											isAnimating ? 'animate-bounce' : '',
											multiSelectVariants({ variant })
										)
									"
									:style="{ animationDuration: `${animation}s` }"
								>
									<component
										v-if="optionMap[value]?.icon"
										:is="optionMap[value].icon"
										class="mr-2 h-4 w-4"
									/>
									{{ optionMap[value]?.label }}
									<XCircle
										class="ml-2 h-4 w-4 cursor-pointer"
										@click.stop="toggleOption(value)"
									/>
								</Badge>
							</template>

							<Badge
								v-if="selectedValues.length > maxCount"
								:class="
									cn(
										'border-foreground/1 bg-transparent text-foreground hover:bg-transparent',
										isAnimating ? 'animate-bounce' : '',
										multiSelectVariants({ variant })
									)
								"
								:style="{ animationDuration: `${animation}s` }"
							>
								+{{ selectedValues.length - maxCount }} more
								<XCircle
									class="ml-2 h-4 w-4 cursor-pointer"
									@click.stop="clearExtraOptions"
								/>
							</Badge>
						</div>

						<div class="flex items-center justify-between">
							<XIcon
								class="mx-2 h-4 cursor-pointer text-muted-foreground"
								@click.stop="clearAll"
							/>
							<Separator orientation="vertical" class="flex h-full min-h-6" />
							<ChevronDown class="mx-2 h-4 text-muted-foreground" />
						</div>
					</div>
				</template>

				<template v-else>
					<div class="mx-auto flex w-full items-center justify-between">
						<span class="mx-3 text-sm text-muted-foreground">
							{{ placeholder }}
						</span>
						<ChevronDown
							class="mx-2 h-4 cursor-pointer text-muted-foreground"
						/>
					</div>
				</template>
			</Button>
		</PopoverTrigger>

		<PopoverContent class="w-auto p-0" align="start">
			<Command>
				<CommandInput
					placeholder="Search..."
					@keydown="handleInputKeyDown"
					v-model="searchTerm"
				/>
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup>
						<CommandItem :value="null" @select="toggleAll">
							<CheckIndicator :checked="allSelected" />
							<span>(Select All)</span>
						</CommandItem>

						<CommandItem
							v-for="option in filteredOptions"
							:key="option.value"
							:value="option.value"
							@select="toggleOption(option.value)"
						>
							<CheckIndicator
								:checked="selectedValues.includes(option.value)"
							/>
							<component
								:is="option.icon"
								v-if="option.icon"
								class="mr-2 h-4 w-4 text-muted-foreground"
							/>
							<span>{{ option.label }}</span>
						</CommandItem>
					</CommandGroup>

					<CommandSeparator />

					<CommandGroup>
						<div class="flex items-center justify-between">
							<CommandItem
								v-if="selectedValues.length"
								:value="null"
								class="flex-1 justify-center"
								@select="clearAll"
							>
								Clear
							</CommandItem>
							<Separator orientation="vertical" class="flex h-full min-h-6" />
							<CommandItem
								:value="null"
								@select="closePopover"
								class="flex-1 justify-center"
							>
								Close
							</CommandItem>
						</div>
					</CommandGroup>
				</CommandList>
			</Command>
		</PopoverContent>

		<WandSparkles
			v-if="animation! > 0 && selectedValues.length"
			class="my-2 h-3 w-3 cursor-pointer bg-background text-foreground"
			:class="{ 'text-muted-foreground': !isAnimating }"
			@click="isAnimating = !isAnimating"
		/>
	</Popover>
</template>

<script setup lang="ts">
import {
	CheckIcon,
	ChevronDown,
	XCircle,
	XIcon,
	WandSparkles
} from 'lucide-vue-next'
import { ref, computed, watch } from 'vue'

import { cn } from '@/lib/utils'
import { multiSelectVariants } from './index'

import {
	Popover,
	PopoverTrigger,
	PopoverContent
} from '@/components/ui/popover'
import {
	Command,
	CommandInput,
	CommandList,
	CommandGroup,
	CommandItem,
	CommandEmpty,
	CommandSeparator
} from '@/components/ui/command'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

// Props
interface Option {
	label: string
	value: string
	icon?: any
}

const props = defineProps<{
	options: Option[]
	defaultValue?: string[]
	onValueChange: (value: string[]) => void
	placeholder?: string
	animation?: number
	maxCount?: number
	variant?: 'default' | 'secondary' | 'destructive' | 'inverted'
	modalPopover?: boolean
	asChild?: boolean
	className?: string
}>()

// Refs + state
const selectedValues = ref<string[]>(props.defaultValue || [])
const isPopoverOpen = ref(false)
const isAnimating = ref(false)
const searchTerm = ref('')

// Mapped options for fast lookup
const optionMap = computed(() =>
	props.options.reduce<Record<string, Option>>((acc, cur) => {
		acc[cur.value] = cur
		return acc
	}, {})
)

const filteredOptions = computed(() =>
	props.options.filter((o) =>
		o.label.toLowerCase().includes(searchTerm.value.toLowerCase())
	)
)

const maxCount = computed(() => props.maxCount ?? 3)
const allSelected = computed(
	() => selectedValues.value.length === props.options.length
)

// Emit on change
watch(selectedValues, (val) => {
	props.onValueChange(val)
})

// Actions
const togglePopover = () => {
	isPopoverOpen.value = !isPopoverOpen.value
}

const toggleOption = (value: string) => {
	if (selectedValues.value.includes(value)) {
		selectedValues.value = selectedValues.value.filter((v) => v !== value)
	} else {
		selectedValues.value = [...selectedValues.value, value]
	}
}

const toggleAll = () => {
	selectedValues.value = allSelected.value
		? []
		: props.options.map((opt) => opt.value)
}

const clearAll = () => {
	selectedValues.value = []
}

const clearExtraOptions = () => {
	selectedValues.value = selectedValues.value.slice(0, maxCount.value)
}

const closePopover = () => {
	isPopoverOpen.value = false
}

const handleInputKeyDown = (event: KeyboardEvent) => {
	if (event.key === 'Enter') {
		isPopoverOpen.value = true
	} else if (event.key === 'Backspace' && !searchTerm.value) {
		selectedValues.value.pop()
	}
}
</script>
