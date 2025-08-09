<template>
	<NuxtLayout name="admin">
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
	middleware: ['auth', 'role'],
	roles: ['admin']
})
</script>

<style scoped></style>
