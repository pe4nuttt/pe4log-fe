<template>
	<div v-html="htmlOutput"></div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: 'client'
})

const dayjs = useDayjs()
const route = useRoute()
const router = useRouter()
const { $api } = useNuxtApp()
const postId = route.params.id

const { data, status, refresh } = await useAsyncData(() =>
	$api.posts.getPostHtmlContent(+postId)
)

const htmlOutput = computed(() => {
	return data.value?.data ?? ''
})
</script>

<style scoped></style>
