<template>
	<div id="app" class="bg-background">
		<div id="app-wrapper" class="h-full w-full">
			<Header />
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import Header from '~/components/layout/client/Header.vue'
</script>

<style scoped lang="scss">
#app {
	font-family: 'IBM Plex Mono', monospace;
}
</style>
