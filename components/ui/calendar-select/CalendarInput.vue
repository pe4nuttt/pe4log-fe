<template>
	<ClientOnly fallback-tag="div" class="v-date-picker-container">
		<v-date-picker
			v-model="modelValue"
			:popover="{ visibility: 'click' }"
			locale="en"
			color="neutral"
			:first-day-of-week="2"
			:max-date="minMax.max"
			:min-date="minMax.min"
			placeholder="hello"
			:masks="masks"
			:attributes="attributes"
			:mode="mode"
			:is-required="isRequired"
			:is-dark="isDark"
		>
			<!-- :select-attribute="selectAttribute" -->
			<template #default="{ inputValue, inputEvents }">
				<Input
					v-bind="$attrs"
					:disabled="disabled"
					:placeholder="placeholder"
					type="text"
					:model-value="inputValue"
					v-on="inputEvents"
				/>
			</template>
		</v-date-picker>
	</ClientOnly>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import Input from '../input/Input.vue'
import { useVModel } from '@vueuse/core'

// Define Props
interface MinMax {
	min: string | null
	max: string | null
}

interface Props {
	mode?: string
	modelValue?: Date | string | null
	minMax?: MinMax
	placeholder?: string
	disabled?: boolean
	outputFormat?: string
	isRequired?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	mode: 'date',
	modelValue: null,
	minMax: () => ({ min: null, max: null }),
	placeholder: 'Pick a date',
	disabled: false,
	outputFormat: 'YYYY-MM-DD',
	isRequired: false
})

const emits = defineEmits<{
	'update:modelValue': (value: Date | string | null) => void
}>()

const colorMode = useColorMode()

const modelValue = useVModel(props, 'modelValue', emits) as Ref<string | null>
const attributes = ref([
	{
		key: 'today',
		dates: new Date(),
		highlight: {
			color: 'gray',
			fillMode: 'outline'
		}
	}
])

// const selectAttribute = {
// 	highlight: {
// 		style: { background: '#357456 !important', 'z-index': 1 }
// 	},
// 	content: {
// 		style: { color: 'white' }
// 	}
// }

const isDark = computed(() => colorMode.value === 'dark')
const masks = computed(() => ({
	modelValue: props.outputFormat,
	input: [props.outputFormat]
}))
</script>
