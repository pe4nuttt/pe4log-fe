<template>
	<div id="auth" class="h-screen w-screen overflow-hidden">
		<div id="auth-wrapper" class="relative h-full w-full">
			<slot />

			<ParticlesBg
				class="absolute inset-0"
				:quantity="100"
				:ease="100"
				:color="isDark ? '#FFF' : '#000'"
				:staticity="10"
				refresh
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import ParticlesBg from '~/components/layout/ParticlesBg.vue'

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')
</script>

<style scoped></style>
