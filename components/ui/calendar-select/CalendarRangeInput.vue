<template>
	<div class="v-date-picker-container flex justify-between gap-2">
		<v-date-picker
			:v-model="modelValue"
			:update-on-input="false"
			:popover="popover"
			locale="en"
			color="neutral"
			:first-day-of-week="2"
			:max-date="minMax.max"
			:min-date="minMax.min"
			placeholder="hello"
			:masks="masks"
			:attributes="attributes"
			:mode="mode"
			:is-dark="isDark"
			is-range
			@popover-did-hide="onChange"
		>
			<template #default="{ inputValue, inputEvents, togglePopover }">
				<div v-bind="$attrs" class="flex w-full items-center gap-2">
					<div class="relative w-full">
						<Input
							:disabled="disabled"
							:placeholder="placeholder"
							type="text"
							:model-value="inputValue.start"
							v-on="inputEvents.start"
							@click="togglePopover"
						/>
					</div>
					<div class="relative w-full">
						<Input
							:disabled="disabled"
							:placeholder="placeholder"
							type="text"
							:model-value="inputValue.end"
							v-on="inputEvents.end"
							@click="togglePopover"
						/>
					</div>
				</div>
			</template>
		</v-date-picker>
	</div>
</template>

<script lang="ts" setup>
import type {
	DateSource,
	SimpleDateParts
} from 'v-calendar/dist/types/src/utils/date/helpers.js'
import type { PopoverOptions } from 'v-calendar/dist/types/src/utils/popovers.js'
import { useVModel } from '@vueuse/core'
import Input from '../input/Input.vue'

interface DateRange {
	start: DateSource
	end: DateSource
}

interface MinMax {
	min: string | null
	max: string | null
}

interface Props {
	mode?: string
	modelValue?: DateRange | null
	minMax?: MinMax
	placeholder?: string
	disabled?: boolean
	format?: string
}

const props = withDefaults(defineProps<Props>(), {
	mode: 'date',
	modelValue: () => ({ start: '', end: '' }),
	minMax: () => ({ min: null, max: null }),
	placeholder: 'Pick a date',
	disabled: false,
	format: 'DD-MM-YYYY'
})

const emits = defineEmits<{
	(event: 'update:model-value', value: DateRange): void
	(event: 'change'): void
}>()

const dayjs = useDayjs()
const colorMode = useColorMode()

const modelValue = useVModel(props, 'modelValue', emits) as Ref<DateRange>

const popover: Partial<PopoverOptions> = {
	visibility: 'click',
	autoHide: true,
	placement: 'bottom-start',
	showDelay: 0,
	hideDelay: 110
}

const isDark = computed(() => colorMode.value === 'dark')

const attributes = computed(() => {
	const current = new Date()
	if (
		dayjs(modelValue.value?.start).isSame(
			dayjs(current).format(props.format)
		) ||
		dayjs(modelValue.value?.end).isSame(dayjs(current).format(props.format))
	) {
		return []
	}
	return [
		{
			key: 'today',
			dates: new Date(),
			highlight: {
				color: 'gray',
				fillMode: 'outline'
			}
		}
	]
})

const masks = computed(() => ({
	modelValue: props.format,
	input: [props.format]
}))
</script>

<style lang="scss"></style>
