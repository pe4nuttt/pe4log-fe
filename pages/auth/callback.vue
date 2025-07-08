<template>
	<div></div>
</template>

<script setup lang="ts">
const route = useRoute()
const { $api } = useNuxtApp()
const { accessToken, refreshToken } = useToken()

const userStore = useUserStore()

watch(
	() => userStore.user,
	(user) => {
		if (user) {
			navigateTo('/')
		}
	}
)

onMounted(async () => {
	if ((accessToken.value && refreshToken.value) || !route.query.accessToken) {
		return navigateTo('/')
	}
	accessToken.value = route.query.accessToken as string
})
</script>

<style scoped></style>
