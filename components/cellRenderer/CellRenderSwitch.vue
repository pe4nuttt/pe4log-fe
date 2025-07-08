<template>
	<div>
		<Switch v-model="isActive" @update:model-value="toggleSwitch" />
	</div>
</template>

<script setup>
import { Switch } from '../ui/switch'

const props = defineProps({
	params: {
		type: Object,
		default: () => {}
	}
})

const isActive = ref(props.params.value ?? false)

watch(
	() => props.params.value,
	() => {
		isActive.value = props.params.value
	}
)

const toggleSwitch = (value) => {
	props.params.context?.componentParent?.onToggleCellSwitch(
		value,
		props.params.data,
		props.params.colDef.field
	)
}
</script>

<style lang="scss" scoped></style>
