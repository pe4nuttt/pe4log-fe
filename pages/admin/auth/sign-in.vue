<template>
	<div>
		<ClientOnly>
			<AuthLogo />
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import AuthLogo from '~/components/auth/AuthLogo.vue'

definePageMeta({
	layout: 'auth'
})
</script>

<style scoped></style>
