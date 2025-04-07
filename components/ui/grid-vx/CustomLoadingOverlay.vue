<template>
	<div class="ag-overlay-loading-center p-3" role="presentation">
		<Loader class="mx-auto mb-2" />
		<div aria-live="polite" aria-atomic="true">{{ params.loadingMessage }}</div>
	</div>
</template>

<script setup>
import Loader from '~/components/global/Loader.vue'

const props = defineProps({
	params: {
		type: Object,
		default: () => {}
	}
})

onMounted(() => {})
</script>

<style lang="scss" scoped></style>
