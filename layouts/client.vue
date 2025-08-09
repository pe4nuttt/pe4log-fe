<template>
	<div id="app" class="bg-background">
		<div id="app-wrapper" class="h-full w-full">
			<Header />
			<div
				id="page-wrapper"
				class="mx-auto w-full min-w-[400px] p-6 md:max-w-[760px] lg:max-w-[1020px] xl:max-w-[1120px] 2xl:max-w-[1280px]"
			>
				<slot />
			</div>
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
