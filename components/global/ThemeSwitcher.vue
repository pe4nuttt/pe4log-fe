<template>
	<Button variant="outline" size="icon" @click="handleToggleTheme">
		<ClientOnly>
			<Icon
				:name="$colorMode.value === 'dark' ? 'lucide:moon' : 'lucide:sun'"
			/>
		</ClientOnly>
	</Button>
</template>

<script setup lang="ts">
import Button from '../ui/button/Button.vue'

const colorMode = useColorMode()

const handleToggleTheme = () => {
	if (colorMode.value === 'dark') {
		colorMode.preference = 'light'
	} else {
		colorMode.preference = 'dark'
	}
}
</script>

<style scoped></style>
